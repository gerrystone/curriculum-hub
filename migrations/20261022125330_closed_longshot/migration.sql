DROP INDEX "learning_outcomes_curriculum_idx";--> statement-breakpoint
ALTER TABLE "learning_outcomes" ADD COLUMN "outcome_id" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "learning_outcomes" ADD COLUMN "document_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_outcomes" ADD COLUMN "source_entry_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_outcomes" ADD COLUMN "outcome_index" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_outcomes" ADD COLUMN "outcome_text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_outcomes" ADD COLUMN "content_hash" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_outcomes" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "learning_outcomes" DROP COLUMN "grade";--> statement-breakpoint
ALTER TABLE "learning_outcomes" DROP COLUMN "subject";--> statement-breakpoint
ALTER TABLE "learning_outcomes" DROP COLUMN "topic";--> statement-breakpoint
ALTER TABLE "learning_outcomes" DROP COLUMN "statement";--> statement-breakpoint
ALTER TABLE "learning_outcomes" DROP COLUMN "source_document_id";--> statement-breakpoint
ALTER TABLE "learning_outcomes" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "learning_outcomes" ADD PRIMARY KEY ("outcome_id");--> statement-breakpoint
CREATE UNIQUE INDEX "learning_outcomes_source_position_uq" ON "learning_outcomes" ("document_id","source_entry_id","outcome_index");--> statement-breakpoint
CREATE INDEX "learning_outcomes_document_idx" ON "learning_outcomes" ("document_id");--> statement-breakpoint
ALTER TABLE "learning_outcomes" ADD CONSTRAINT "learning_outcomes_document_id_corpus_documents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "corpus_documents"("document_id") ON DELETE CASCADE;