import {
    pgTable,
    pgEnum,
    varchar,
    integer,
    text,
    jsonb,
    timestamp,
    index,
    unique,
    uuid, vector
} from "drizzle-orm/pg-core";

export const corpusDocumentTypeEnum = pgEnum(
    "corpus_document_type",
    [
        "scheme_of_work",
        "sample_assessment",
        "learning_outcomes",
    ],
);

export const corpusDocuments = pgTable(
    "corpus_documents",
    {
        documentId: uuid("document_id").primaryKey().defaultRandom(),

        sourceId: text("source_id")
            .notNull()
            .unique(),

        documentType: corpusDocumentTypeEnum("document_type")
            .notNull(),

        title: text("title").notNull(),

        subject: varchar("subject", { length: 150 }).notNull(),

        grade: integer("grade").notNull(),

        metadata: jsonb("metadata")
            .$type<Record<string, unknown>>()
            .notNull(),

        ingestedAt: timestamp("ingested_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
        contentHash: varchar("content_hash", { length: 64 })
            .notNull(),
    },
    (table) => [
        index("corpus_documents_subject_grade_idx").on(
            table.subject,
            table.grade,
        ),
    ],
);

export const corpusChunks = pgTable(
    "corpus_chunks",
    {
        id: uuid("corpus_chunk")
            .primaryKey()
            .defaultRandom(),

        documentId: uuid("document_id")
            .notNull()
            .references(() => corpusDocuments.documentId, {
                onDelete: "cascade",
            }),

        chunkType: varchar("chunk_type", { length: 50 })
            .notNull(),

        chunkIndex: integer("chunk_index").notNull(),

        sourceEntryId: varchar("source_entry_id", {
            length: 255,
        }).notNull(),

        topic: text("topic").notNull(),

        content: jsonb("content")
            .$type<Record<string, unknown>>()
            .notNull(),

        textContent: text("text_content").notNull(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
        contentHash: varchar("content_hash", { length: 64 })
            .notNull(),
    },
    (table) => [
        unique("corpus_chunks_document_source_unique").on(
            table.documentId,
            table.sourceEntryId,
        ),
        index("corpus_chunks_document_idx").on(table.documentId),
    ],
);

export const corpusEmbeddings = pgTable(
    "corpus_embeddings",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        chunkId: uuid("chunk_id")
            .notNull()
            .references(() => corpusChunks.id, {
                onDelete: "cascade",
            }),

        model: varchar("model", { length: 255 }).notNull(),

        embedding: vector("embedding", {
            dimensions: 1536,
        }).notNull(),

        embeddingHash: varchar("embedding_hash", {
            length: 64,
        }).notNull(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("corpus_embeddings_chunk_model_unique").on(
            table.chunkId,
            table.model,
        ),
        index("corpus_embeddings_model_idx").on(table.model),
    ],
);