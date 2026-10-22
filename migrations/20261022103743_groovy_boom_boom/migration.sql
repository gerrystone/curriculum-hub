CREATE TYPE "corpus_document_type" AS ENUM('scheme_of_work', 'sample_assessment', 'learning_outcomes');--> statement-breakpoint
CREATE TYPE "account_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TYPE "lesson_plan_status" AS ENUM('draft', 'submitted', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "lesson_plan_version_status" AS ENUM('draft', 'submitted', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('teacher', 'curriculum_lead');--> statement-breakpoint
CREATE TABLE "corpus_chunks" (
	"corpus_chunk" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"document_id" uuid NOT NULL,
	"chunk_type" varchar(50) NOT NULL,
	"chunk_index" integer NOT NULL,
	"source_entry_id" varchar(255) NOT NULL,
	"topic" text NOT NULL,
	"content" jsonb NOT NULL,
	"text_content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"content_hash" varchar(64) NOT NULL,
	CONSTRAINT "corpus_chunks_document_source_unique" UNIQUE("document_id","source_entry_id")
);
--> statement-breakpoint
CREATE TABLE "corpus_documents" (
	"document_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"document_type" "corpus_document_type" NOT NULL,
	"title" text NOT NULL,
	"subject" varchar(150) NOT NULL,
	"grade" integer NOT NULL,
	"metadata" jsonb NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"content_hash" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "corpus_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"chunk_id" uuid NOT NULL,
	"model" varchar(255) NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"embedding_hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "corpus_embeddings_chunk_model_unique" UNIQUE("chunk_id","model")
);
--> statement-breakpoint
CREATE TABLE "learning_outcomes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"grade" varchar(50) NOT NULL,
	"subject" varchar(150) NOT NULL,
	"topic" varchar(255) NOT NULL,
	"statement" text NOT NULL,
	"source_document_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_plan_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"lesson_plan_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"content" jsonb NOT NULL,
	"status" "lesson_plan_version_status" DEFAULT 'draft'::"lesson_plan_version_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"submitted_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" uuid,
	"review_comment" text,
	CONSTRAINT "lesson_plan_version_number_unique" UNIQUE("lesson_plan_id","version"),
	CONSTRAINT "lesson_plan_versions_version_positive" CHECK ("version" >= 1)
);
--> statement-breakpoint
CREATE TABLE "lesson_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(255) NOT NULL,
	"created_by" uuid NOT NULL,
	"grade" varchar(50) NOT NULL,
	"subject" varchar(150) NOT NULL,
	"topic" varchar(255) NOT NULL,
	"current_version" integer DEFAULT 1 NOT NULL,
	"status" "lesson_plan_status" DEFAULT 'draft'::"lesson_plan_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lesson_plans_current_version_positive" CHECK ("current_version" >= 1)
);
--> statement-breakpoint
CREATE TABLE "teacher_curriculum_lead" (
	"teacher_id" uuid NOT NULL CONSTRAINT "teacher_curriculum_lead_teacher_unique" UNIQUE,
	"curriculum_lead_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_curriculum_lead_pair_unique" UNIQUE("teacher_id","curriculum_lead_id"),
	CONSTRAINT "teacher_curriculum_lead_different_users" CHECK ("teacher_id" <> "curriculum_lead_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"account_status" "account_status" DEFAULT 'active'::"account_status" NOT NULL,
	"role" "user_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "corpus_chunks_document_idx" ON "corpus_chunks" ("document_id");--> statement-breakpoint
CREATE INDEX "corpus_documents_subject_grade_idx" ON "corpus_documents" ("subject","grade");--> statement-breakpoint
CREATE INDEX "corpus_embeddings_model_idx" ON "corpus_embeddings" ("model");--> statement-breakpoint
CREATE INDEX "learning_outcomes_curriculum_idx" ON "learning_outcomes" ("grade","subject","topic");--> statement-breakpoint
CREATE INDEX "lesson_plan_versions_plan_idx" ON "lesson_plan_versions" ("lesson_plan_id","version");--> statement-breakpoint
CREATE INDEX "lesson_plans_created_by_idx" ON "lesson_plans" ("created_by");--> statement-breakpoint
CREATE INDEX "lesson_plans_status_idx" ON "lesson_plans" ("status");--> statement-breakpoint
CREATE INDEX "lesson_plans_curriculum_idx" ON "lesson_plans" ("grade","subject","topic");--> statement-breakpoint
ALTER TABLE "corpus_chunks" ADD CONSTRAINT "corpus_chunks_document_id_corpus_documents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "corpus_documents"("document_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "corpus_embeddings" ADD CONSTRAINT "corpus_embeddings_chunk_id_corpus_chunks_corpus_chunk_fkey" FOREIGN KEY ("chunk_id") REFERENCES "corpus_chunks"("corpus_chunk") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lesson_plan_versions" ADD CONSTRAINT "lesson_plan_versions_lesson_plan_id_lesson_plans_id_fkey" FOREIGN KEY ("lesson_plan_id") REFERENCES "lesson_plans"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lesson_plan_versions" ADD CONSTRAINT "lesson_plan_versions_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "lesson_plan_versions" ADD CONSTRAINT "lesson_plan_versions_reviewed_by_users_id_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "lesson_plans" ADD CONSTRAINT "lesson_plans_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "teacher_curriculum_lead" ADD CONSTRAINT "teacher_curriculum_lead_teacher_id_users_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "teacher_curriculum_lead" ADD CONSTRAINT "teacher_curriculum_lead_curriculum_lead_id_users_id_fkey" FOREIGN KEY ("curriculum_lead_id") REFERENCES "users"("id") ON DELETE RESTRICT;