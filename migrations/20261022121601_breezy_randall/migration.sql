ALTER TABLE "corpus_documents" ADD COLUMN "source_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "corpus_documents" ADD CONSTRAINT "corpus_documents_source_id_key" UNIQUE("source_id");