import {
    pgTable,
    uuid,
    text,
    integer,
    varchar,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { corpusDocuments } from "./corpus";

export const learningOutcomes = pgTable(
    "learning_outcomes",
    {
        outcomeId: uuid("outcome_id")
            .primaryKey()
            .defaultRandom(),

        documentId: uuid("document_id")
            .notNull()
            .references(() => corpusDocuments.documentId, {
                onDelete: "cascade",
            }),

        sourceEntryId: text("source_entry_id").notNull(),

        outcomeIndex: integer("outcome_index").notNull(),

        outcomeText: text("outcome_text").notNull(),

        contentHash: varchar("content_hash", {
            length: 64,
        }).notNull(),
    },
    (table) => [
        uniqueIndex("learning_outcomes_source_position_uq").on(
            table.documentId,
            table.sourceEntryId,
            table.outcomeIndex,
        ),
        index("learning_outcomes_document_idx").on(
            table.documentId,
        ),
    ],
);