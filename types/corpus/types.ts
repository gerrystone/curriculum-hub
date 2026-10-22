import {CorpusDocument} from "@/backend/lib/corpus-validation";

export type ChunkInput = {
    chunkType: string;
    chunkIndex: number;
    sourceEntryId: string;
    topic: string;
    content: Record<string, unknown>;
    textContent: string;
    contentHash: string;
};

export type PreparedChunk = ChunkInput & {
    embeddingText: string;
    embeddingHash: string;
};

export type PreparedDocument = {
    document: CorpusDocument;
    metadata: Record<string, unknown>;
    documentHash: string;
    chunks: PreparedChunk[];
};
export type ExistingChunkEmbeddingState = {
    chunkHash: string;
    embeddingHash: string | null;
};

export type GeneratedEmbedding = {
    contentHash: string;
    embedding: number[];
};

export type IngestionReport = {
    filesFound: number;
    documentsProcessed: number;
    documentsWithNoNewEmbeddings: number;
    chunksProcessed: number;
    embeddingsGenerated: number;
    failures: Array<{
        file: string;
        error: string;
    }>;
};

export type ExtractedLearningOutcome = {
    sourceEntryId: string;
    outcomeIndex: number;
    outcomeText: string;
    contentHash: string;
};
