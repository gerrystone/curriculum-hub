import {ExistingChunkEmbeddingState, GeneratedEmbedding, IngestionReport, PreparedDocument} from "@/types/corpus/types";
import {db} from "@/db/drizzle";
import {corpusChunks, corpusDocuments, corpusEmbeddings} from "@/db/schema/corpus";
import {and, eq, notInArray} from "drizzle-orm";
import {EMBEDDING_DIMENSIONS, embeddingProvider} from "@/backend/lib/ai/embeddings";
import path from "node:path";
import {readdir, readFile} from "node:fs/promises";
import {corpusDocumentSchema} from "@/backend/lib/corpus-validation";
import {prepareDocumentForIngestion} from "@/backend/lib/chunking";

const EMBEDDING_BATCH_SIZE = 50;

function splitIntoBatches<T>(items: T[], batchSize: number,): T[][] {
    const batches: T[][] = [];

    for (let index = 0; index < items.length; index += batchSize) {
        batches.push(items.slice(index, index + batchSize));
    }

    return batches;
}

async function getExistingChunkEmbeddingState(documentId: string): Promise<Map<string, ExistingChunkEmbeddingState>> {
    const rows = await db
        .select({
            sourceEntryId: corpusChunks.sourceEntryId,
            chunkHash: corpusChunks.contentHash,
            embeddingHash: corpusEmbeddings.embeddingHash,
        })
        .from(corpusChunks)
        .leftJoin(
            corpusEmbeddings,
            eq(corpusEmbeddings.chunkId, corpusChunks.id),
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

async function generateMissingOrStaleEmbeddings(preparedDocument: PreparedDocument, existingState: Map<string, ExistingChunkEmbeddingState>,): Promise<Map<string, GeneratedEmbedding>> {
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
                "Mock embedding provider returned invalid vectors.",
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

async function upsertDocumentChunksAndEmbeddings(preparedDocument: PreparedDocument, generatedEmbeddings: Map<string, GeneratedEmbedding>,): Promise<void> {
    const { document, metadata, documentHash, chunks } = preparedDocument;

    await db.transaction(async (tx) => {
        const [insertedDocument]  = await tx
            .insert(corpusDocuments)
            .values({
                documentType: document.documentType,
                title: document.title,
                subject: document.subject,
                grade: document.grade,
                metadata,
                contentHash: documentHash,
                ingestedAt: new Date(),
            }).returning({
                id: corpusDocuments.documentId,
            });

        const documentId = insertedDocument.id;

        for (const chunk of chunks) {
            await tx
                .insert(corpusChunks)
                .values({
                    documentId: documentId,
                    chunkType: chunk.chunkType,
                    chunkIndex: chunk.chunkIndex,
                    sourceEntryId: chunk.sourceEntryId,
                    topic: chunk.topic,
                    content: chunk.content,
                    textContent: chunk.textContent,
                    contentHash: chunk.contentHash,
                })
        }

        const sourceEntryIds = chunks.map(
            (chunk) => chunk.sourceEntryId,
        );

        if (sourceEntryIds.length === 0) {
            await tx
                .delete(corpusChunks)
                .where(
                    eq(
                        corpusChunks.documentId,
                        documentId,
                    ),
                );
        } else {
            await tx
                .delete(corpusChunks)
                .where(
                    and(
                        eq(
                            corpusChunks.documentId,
                            documentId,
                        ),
                        notInArray(
                            corpusChunks.sourceEntryId,
                            sourceEntryIds,
                        ),
                    ),
                );
        }

        const persistedChunks = await tx
            .select({
                id: corpusChunks.id,
                sourceEntryId: corpusChunks.sourceEntryId,
            })
            .from(corpusChunks)
            .where(
                eq(corpusChunks.documentId, documentId),
            );

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

export async function ingestCorpusDirectory(corpusDirectory = path.join(process.cwd(), "data", "corpus",),): Promise<IngestionReport> {

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

            const existingState = await getExistingChunkEmbeddingState(
                preparedDocument.document.documentId,
            );

            const generatedEmbeddings =
                await generateMissingOrStaleEmbeddings(
                    preparedDocument,
                    existingState,
                );

            await upsertDocumentChunksAndEmbeddings(
                preparedDocument,
                generatedEmbeddings,
            );

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
            console.error(`[ingest] Failed ${file}: ${message}`);
        }
    }

    console.log("[ingest] Complete:", report);

    return report;
}