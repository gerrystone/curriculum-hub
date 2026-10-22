
import type {
    ExistingChunkEmbeddingState, ExtractedLearningOutcome,
    GeneratedEmbedding,
    IngestionReport,
    PreparedDocument,
} from "@/types/corpus/types";

import { db } from "@/db/drizzle";
import {
    corpusChunks,
    corpusDocuments,
    corpusEmbeddings,
} from "@/db/schema/corpus";
import {and, eq, inArray, notInArray, sql, type SQL} from "drizzle-orm";
import {
    EMBEDDING_DIMENSIONS,
    embeddingProvider,
} from "@/backend/lib/ai/embeddings";
import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import {CorpusDocument, corpusDocumentSchema} from "@/backend/lib/corpus-validation";
import { prepareDocumentForIngestion } from "@/backend/lib/chunking";
import {hashContent} from "@/backend/lib/corpus-hash";
import {learningOutcomes} from "@/db/schema/learning_outcomes";

const EMBEDDING_BATCH_SIZE = 50;

function getSourceId(file: string): string {
    return path.parse(file).name;
}

function splitIntoBatches<T>(
    items: T[],
    batchSize: number,
): T[][] {
    const batches: T[][] = [];

    for (let index = 0; index < items.length; index += batchSize) {
        batches.push(items.slice(index, index + batchSize));
    }

    return batches;
}
function extractLearningOutcomes(document: CorpusDocument): ExtractedLearningOutcome[] {
    if (document.documentType !== "scheme_of_work") {
        return [];
    }

    return document.entries.flatMap((entry) =>
        entry.learningOutcomes.map((outcome, index) => ({
            sourceEntryId: entry.entryId,
            outcomeIndex: index,
            outcomeText: outcome,
            contentHash: hashContent(outcome),
        })),
    );
}
async function getOrCreateDocumentId(
    preparedDocument: PreparedDocument,
    sourceId: string,
): Promise<string> {
    const { document, metadata, documentHash } = preparedDocument;

    const [savedDocument] = await db
        .insert(corpusDocuments)
        .values({
            sourceId,
            documentType: document.documentType,
            title: document.title,
            subject: document.subject,
            grade: document.grade,
            metadata,
            contentHash: documentHash,
            ingestedAt: new Date(),
        })
        .onConflictDoUpdate({
            target: corpusDocuments.sourceId,
            set: {
                documentType: document.documentType,
                title: document.title,
                subject: document.subject,
                grade: document.grade,
                metadata,
                contentHash: documentHash,
                ingestedAt: new Date(),
            },
        })
        .returning({
            id: corpusDocuments.documentId,
        });

    if (!savedDocument) {
        throw new Error(
            `Could not resolve database ID for "${sourceId}".`,
        );
    }

    return savedDocument.id;
}

async function getExistingChunkEmbeddingState(
    documentId: string,
): Promise<Map<string, ExistingChunkEmbeddingState>> {
    const rows = await db
        .select({
            sourceEntryId: corpusChunks.sourceEntryId,
            chunkHash: corpusChunks.contentHash,
            embeddingHash: corpusEmbeddings.embeddingHash,
        })
        .from(corpusChunks)
        .leftJoin(
            corpusEmbeddings,
            and(
                eq(corpusEmbeddings.chunkId, corpusChunks.id),
                eq(corpusEmbeddings.model, embeddingProvider.model),
            ),
        )
        .where(eq(corpusChunks.documentId, documentId));

    return new Map(
        rows.map((row) => [
            row.sourceEntryId,
            {
                chunkHash: row.chunkHash,
                embeddingHash: row.embeddingHash,
            },
        ]),
    );
}

async function generateMissingOrStaleEmbeddings(
    preparedDocument: PreparedDocument,
    existingState: Map<string, ExistingChunkEmbeddingState>,
): Promise<Map<string, GeneratedEmbedding>> {
    const chunksNeedingEmbeddings = preparedDocument.chunks.filter(
        (chunk) => {
            const existing = existingState.get(chunk.sourceEntryId);

            return (
                !existing ||
                existing.chunkHash !== chunk.contentHash ||
                existing.embeddingHash !== chunk.embeddingHash
            );
        },
    );

    const generated = new Map<string, GeneratedEmbedding>();

    for (const batch of splitIntoBatches(
        chunksNeedingEmbeddings,
        EMBEDDING_BATCH_SIZE,
    )) {
        const vectors = await embeddingProvider.embedMany(
            batch.map((chunk) => chunk.embeddingText),
        );

        if (
            vectors.length !== batch.length ||
            vectors.some(
                (vector) =>
                    vector.length !== EMBEDDING_DIMENSIONS ||
                    vector.some((value) => !Number.isFinite(value)),
            )
        ) {
            throw new Error(
                "Embedding provider returned invalid vectors.",
            );
        }

        batch.forEach((chunk, index) => {
            generated.set(chunk.sourceEntryId, {
                contentHash: chunk.embeddingHash,
                embedding: vectors[index],
            });
        });
    }

    return generated;
}


async function upsertDocumentChunksAndEmbeddings(
    preparedDocument: PreparedDocument,
    documentId: string,
    generatedEmbeddings: Map<string, GeneratedEmbedding>,
): Promise<void> {
    const { chunks } = preparedDocument;

    await db.transaction(async (tx) => {
        for (const chunk of chunks) {
            await tx
                .insert(corpusChunks)
                .values({
                    documentId,
                    chunkType: chunk.chunkType,
                    chunkIndex: chunk.chunkIndex,
                    sourceEntryId: chunk.sourceEntryId,
                    topic: chunk.topic,
                    content: chunk.content,
                    textContent: chunk.textContent,
                    contentHash: chunk.contentHash,
                })
                .onConflictDoUpdate({
                    target: [
                        corpusChunks.documentId,
                        corpusChunks.sourceEntryId,
                    ],
                    set: {
                        chunkType: chunk.chunkType,
                        chunkIndex: chunk.chunkIndex,
                        topic: chunk.topic,
                        content: chunk.content,
                        textContent: chunk.textContent,
                        contentHash: chunk.contentHash,
                    },
                });
        }

        const obsoleteChunks = chunks.length === 0
            ? await tx
                .select({ id: corpusChunks.id })
                .from(corpusChunks)
                .where(eq(corpusChunks.documentId, documentId))
            : await tx
                .select({ id: corpusChunks.id })
                .from(corpusChunks)
                .where(
                    and(
                        eq(corpusChunks.documentId, documentId),
                        notInArray(
                            corpusChunks.sourceEntryId,
                            chunks.map((chunk) => chunk.sourceEntryId),
                        ),
                    ),
                );

        const obsoleteChunkIds = obsoleteChunks.map(
            (chunk) => chunk.id,
        );

        if (obsoleteChunkIds.length > 0) {
            await tx
                .delete(corpusEmbeddings)
                .where(
                    inArray(
                        corpusEmbeddings.chunkId,
                        obsoleteChunkIds,
                    ),
                );

            await tx
                .delete(corpusChunks)
                .where(inArray(corpusChunks.id, obsoleteChunkIds));
        }

        // Resolve database chunk IDs using their stable source entry IDs.
        const persistedChunks = await tx
            .select({
                id: corpusChunks.id,
                sourceEntryId: corpusChunks.sourceEntryId,
            })
            .from(corpusChunks)
            .where(eq(corpusChunks.documentId, documentId));

        const chunkIdBySourceEntryId = new Map(
            persistedChunks.map((chunk) => [
                chunk.sourceEntryId,
                chunk.id,
            ]),
        );

        for (const [sourceEntryId, generated] of generatedEmbeddings) {
            const chunkId = chunkIdBySourceEntryId.get(sourceEntryId);

            if (!chunkId) {
                throw new Error(
                    `Could not find persisted chunk "${sourceEntryId}".`,
                );
            }

            await tx
                .insert(corpusEmbeddings)
                .values({
                    chunkId,
                    model: embeddingProvider.model,
                    embeddingHash: generated.contentHash,
                    embedding: generated.embedding,
                    createdAt: new Date(),
                })
                .onConflictDoUpdate({
                    target: [
                        corpusEmbeddings.chunkId,
                        corpusEmbeddings.model,
                    ],
                    set: {
                        embeddingHash: generated.contentHash,
                        embedding: generated.embedding,
                        createdAt: new Date(),
                    },
                });
        }
    });
}

async function upsertLearningOutcomes(documentId: string, outcomes: ExtractedLearningOutcome[],): Promise<void> {
    await db.transaction(async (tx) => {
        if (outcomes.length > 0) {
            await tx
                .insert(learningOutcomes)
                .values(
                    outcomes.map((outcome) => ({
                        documentId,
                        sourceEntryId: outcome.sourceEntryId,
                        outcomeIndex: outcome.outcomeIndex,
                        outcomeText: outcome.outcomeText,
                        contentHash: outcome.contentHash,
                    })),
                )
                .onConflictDoUpdate({
                    target: [
                        learningOutcomes.documentId,
                        learningOutcomes.sourceEntryId,
                        learningOutcomes.outcomeIndex,
                    ],
                    set: {
                        outcomeText:
                            sql`excluded.outcome_text`,
                        contentHash:
                            sql`excluded.content_hash`,
                    },
                });
        }

        // Remove outcomes that no longer exist in the source.
        const current = await tx
            .select({
                sourceEntryId:
                learningOutcomes.sourceEntryId,
                outcomeIndex:
                learningOutcomes.outcomeIndex,
            })
            .from(learningOutcomes)
            .where(
                eq(learningOutcomes.documentId, documentId),
            );

        const currentKeys = new Set(
            outcomes.map(
                (o) => `${o.sourceEntryId}:${o.outcomeIndex}`,
            ),
        );

        const obsolete = current.filter(
            (o) =>
                !currentKeys.has(
                    `${o.sourceEntryId}:${o.outcomeIndex}`,
                ),
        );

        for (const outcome of obsolete) {
            await tx
                .delete(learningOutcomes)
                .where(
                    and(
                        eq(
                            learningOutcomes.documentId,
                            documentId,
                        ),
                        eq(
                            learningOutcomes.sourceEntryId,
                            outcome.sourceEntryId,
                        ),
                        eq(
                            learningOutcomes.outcomeIndex,
                            outcome.outcomeIndex,
                        ),
                    ),
                );
        }
    });
}
export async function ingestCorpusDirectory(
    corpusDirectory = path.join(
        process.cwd(),
        "data",
        "corpus",
    ),
): Promise<IngestionReport> {
    const files = (await readdir(corpusDirectory))
        .filter((file) => file.toLowerCase().endsWith(".json"))
        .sort();

    const report: IngestionReport = {
        filesFound: files.length,
        documentsProcessed: 0,
        documentsWithNoNewEmbeddings: 0,
        chunksProcessed: 0,
        embeddingsGenerated: 0,
        failures: [],
    };

    for (const file of files) {
        try {
            const filePath = path.join(corpusDirectory, file);
            const fileContent = await readFile(filePath, "utf8");
            const parsedDocument: unknown = JSON.parse(fileContent);

            const validation = corpusDocumentSchema.safeParse(
                parsedDocument,
            );

            if (!validation.success) {
                throw new Error(
                    `Document validation failed: ${validation.error.message}`,
                );
            }

            const preparedDocument = prepareDocumentForIngestion(
                validation.data,
            );

            // 1. Derive a stable identity from the filename.
            const sourceId = getSourceId(file);

            // 2. Insert/find the document and obtain its database UUID.
            const documentId = await getOrCreateDocumentId(
                preparedDocument,
                sourceId,
            );

            // 3. Look up chunks using the actual database UUID.
            const existingState =
                await getExistingChunkEmbeddingState(documentId);

            // 4. Generate only missing or stale vectors.
            const generatedEmbeddings =
                await generateMissingOrStaleEmbeddings(
                    preparedDocument,
                    existingState,
                );

            // 5. Persist chunks and vectors against that same UUID.
            await upsertDocumentChunksAndEmbeddings(
                preparedDocument,
                documentId,
                generatedEmbeddings,
            );

            const outcomes = extractLearningOutcomes(preparedDocument.document)

            await upsertLearningOutcomes(documentId, outcomes)
            report.documentsProcessed += 1;
            report.chunksProcessed += preparedDocument.chunks.length;
            report.embeddingsGenerated += generatedEmbeddings.size;

            if (generatedEmbeddings.size === 0) {
                report.documentsWithNoNewEmbeddings += 1;
            }

            console.log(
                `[ingest] ${file}: ` +
                `${preparedDocument.chunks.length} chunks processed; ` +
                `${generatedEmbeddings.size} embeddings generated.`,
            );
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);

            report.failures.push({ file, error: message });
            console.error(`[ingest] Failed ${file}:`, error);
        }
    }

    console.log("[ingest] Complete:", report);

    return report;
}
