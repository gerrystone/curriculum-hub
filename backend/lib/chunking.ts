import {CorpusDocument} from "@/backend/lib/corpus-validation";
import {ChunkInput, PreparedDocument} from "@/types/corpus/types";
import {hashContent} from "@/backend/lib/corpus-hash";

export function serializeChunkContentToText(content: Record<string, unknown>):string{
    return  Object.entries(content)
        .map(([key, value])=>{
        let serializedValue: string;

        if(Array.isArray(value)){
            serializedValue = value
                .map((item)=>
                    typeof  item ==="object" && item  !==null ? JSON.stringify(item) :
                        String(item ?? "")
                )
                .join("; ")
        } else if (
            typeof value === "object" && value !== null
        ) {
            serializedValue = JSON.stringify(value)
        } else {
            serializedValue =  String(value ?? "");
        }
        return `${key}: ${serializedValue}`
    }).join("\n")
}

export function createDocumentChunks(document: CorpusDocument):ChunkInput[]{
    if (document.documentType === "scheme_of_work") {
        return document.entries.map((entry, index) => {
            const content: Record<string, unknown> = { ...entry };

            return {
                chunkType: "scheme_entry",
                chunkIndex: index,
                sourceEntryId: entry.entryId,
                topic: entry.topic,
                content,
                textContent: serializeChunkContentToText(content),
                contentHash: hashContent(content),
            };
        });
    }

    if (document.documentType === "sample_assessment") {
        return document.items.map((item, index) => {
            const content: Record<string, unknown> = { ...item };

            return {
                chunkType: "assessment_item",
                chunkIndex: index,
                sourceEntryId: item.itemId,
                topic: item.topic,
                content,
                textContent: serializeChunkContentToText(content),
                contentHash: hashContent(content),
            };
        });
    }

    return document.outcomes.map((outcome, index) => {
        const content: Record<string, unknown> = { ...outcome };

        return {
            chunkType: "learning_outcome",
            chunkIndex: index,
            sourceEntryId: outcome.outcomeId,
            topic: outcome.topic,
            content,
            textContent: serializeChunkContentToText(content),
            contentHash: hashContent(content),
        };
    });
}

export function buildChunkEmbeddingInput(document: CorpusDocument, chunk: ChunkInput): string {
    return [
        `Document: ${document.title}`,
        `Document type: ${document.documentType}`,
        `Subject: ${document.subject}`,
        `Grade: ${document.grade}`,
        chunk.textContent,
    ].join("\n");
}

export function extractDocumentMetadata(document: CorpusDocument,): Record<string, unknown> {
    const {entries: _entries, items: _items, outcomes: _outcomes, ...metadata} = document as CorpusDocument & {
        entries?: unknown;
        items?: unknown;
        outcomes?: unknown;
    };

    return metadata;
}

export function prepareDocumentForIngestion(document: CorpusDocument,): PreparedDocument {
    const chunks = createDocumentChunks(document);

    return {
        document,
        metadata: extractDocumentMetadata(document),
        documentHash: hashContent(document),
        chunks: chunks.map((chunk) => {
            const embeddingText = buildChunkEmbeddingInput(
                document,
                chunk,
            );

            return {
                ...chunk,
                embeddingText,
                embeddingHash: hashContent(embeddingText),
            };
        }),
    };
}