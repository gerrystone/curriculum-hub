# Curriculum Design Hub

An AI-assisted curriculum planning prototype that demonstrates how teachers can generate curriculum-grounded lesson plans, edit and save drafts, and explore a review workflow for Curriculum Leads.

**Project status:** Prototype. The core generation and persistence workflow is implemented, but the complete teacher-to-reviewer workflow is not finished end to end.

**Loom link:** https://www.loom.com/share/a0857f6e485c42a4a29c944783b5f915
## 1. Features

- Select a learning outcome, grade, subject, and lesson duration.
- Generate structured lesson plans using a mock generation provider.
- Validate generated plans against a defined lesson plan schema.
- Associate generated plans with retrieved curriculum source chunks.
- Edit generated lesson plans before saving.
- Persist lesson plan metadata and versioned JSON content.
- Allow Curriculum Leads to view saved lesson plans.
- Display approve and reject actions in the Curriculum Lead interface.

### Current limitations

The prototype was developed within a limited timeframe, so some functionality is incomplete:

- **Mock generation only:** There is no real LLM integration or LLM API-key configuration.
- **Teacher lesson plan list:** The teacher currently sees a dummy list of lesson plans rather than a fully integrated list of saved plans.
- **Curriculum Lead review:** The Curriculum Lead can view saved lesson plans and sees approve/reject buttons, but the approval and rejection backend operations have not been implemented.
- **Rejection comments:** The intended behaviour is for clicking Reject to reveal an input field where the Curriculum Lead can enter a reason or review comments. This interaction is not yet implemented.
- **Complete workflow:** The full process of teacher submission, Curriculum Lead review, status updates, and feedback to the teacher is not implemented end to end.

These limitations are documented to distinguish the working prototype from the intended application.

## 2. Technology Stack

- Next.js App Router
- React and TypeScript
- Drizzle ORM
- PostgreSQL with `pgvector`
- JWT-based authentication
- Zod schema validation
- Docker Compose for local database services
- Mock lesson plan generation

## 3. Prerequisites

Install the following tools:

- Node.js and npm
- Docker Desktop with Docker Compose
- Git

## 4. Install and Run Locally

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd curriculum-hub
npm install
```

The local development script creates `.env.local` from `.env.example` if `.env.local` does not already exist.

Review the generated `.env.local` and configure any required local values. The environment template should contain the required variable names and safe development placeholders.

Start the application:

```bash
npm run dev:local
```

The local setup script runs the following steps:

1. Starts the PostgreSQL service using Docker Compose.
2. Applies database migrations.
3. Ingests the curriculum corpus.
4. Seeds demo users and required data.
5. Starts the Next.js development server.

Open the local URL printed by Next.js, normally `http://localhost:3000`.

### Useful development commands

```bash
npm run dev
npm run db:migrate
npm run db:ingestion
npm run db:seed
```

The `dev:local` script automates the database startup, migration, ingestion, seeding, and application startup steps.

### Environment configuration

- `.env.example` is committed to the repository as a configuration template.
- `.env.local` is created locally and should not be committed.
- The prototype uses mock generation and does not require an LLM API key.

## 5. Demo Accounts and Suggested Walkthrough

The seed scripts create demo users for the supported roles. Use the credentials defined in the repository's seed files.

| Role | Available functionality |
|---|---|
| Teacher | Generate, edit, and save lesson plans; view the current dummy lesson plan list |
| Curriculum Lead | View saved lesson plans and access the approve/reject interface |

## Demo Accounts

Use the following accounts to explore the prototype. Both accounts share the same demo password.

| Name | Email | Role |
|---|---|---|
| Brian Otieno | brian.lead@example.com | Curriculum Lead |
| Carol Njeri | carol.teacher@example.com | Teacher |

**Demo password for both accounts:** `P@ssw0rd!`

### Suggested Click-Through

**Teacher — Carol Njeri**
1. Sign in using `carol.teacher@example.com`.
2. Select a grade, subject, learning outcome, and lesson duration.
3. Generate a lesson plan using the mock generation workflow.
4. Review and edit the generated content.
5. Save the lesson plan.
6. Note that the teacher's lesson-plan list currently uses dummy data and is not connected to saved lesson plans.

**Curriculum Lead — Brian Otieno**
1. Sign in using `brian.lead@example.com`.
2. Open the saved lesson plans.
3. Inspect the available Approve and Reject buttons.
4. Note that approval and rejection are currently UI-only; backend review actions are not implemented.


### Suggested click-through

**Teacher workflow**

1. Sign in using the Teacher demo account.
2. Open the lesson plan creation page.
3. Select a grade and subject.
4. Select a learning outcome and enter the lesson duration.
5. Generate a lesson plan using mock generation.
6. Review the generated objectives, starter, main activities, checks for understanding, conclusion, and assessment.
7. Edit the plan and try resetting changes.
8. Save the lesson plan.
9. Note that the teacher's lesson plan list is currently a dummy list and is not fully connected to saved lesson plans.

**Curriculum Lead workflow**

1. Sign in using the Curriculum Lead demo account.
2. Open the saved lesson plans view.
3. Select a saved lesson plan and inspect its details.
4. Observe the Approve and Reject buttons.
5. Note that these buttons are currently UI-only: the backend status changes and complete review workflow are not implemented.
6. The intended rejection flow is to display a comment input when Reject is clicked, allowing the Curriculum Lead to explain the decision.

## 6. Application Structure

The project uses the Next.js App Router with the `app/` directory at the repository root.

The exact organization of feature and service files should be checked against the current repository.

| Area            | Responsibility                                                                  |
|-----------------|---------------------------------------------------------------------------------|
| `app/`          | Next.js pages, layouts, and API route handlers                                  |
| `backend/`      | Backend services and application logic, depending on the current project layout |
| `db/`           | Drizzle database client and schema definitions                                  |
| `features/`     | Feature-specific hooks, components, and UI                                      |
| `data/corpus/`  | JSON curriculum source documents                                                |
| `scripts/`      | Local development setup, ingestion, and database seeding                        |
| `tests/unit`    | Unit tests                                                                          |

### Main data model

**Users**

Stores user identity, credentials, and role information. The supported roles are Teacher and Curriculum Lead.

**Learning outcomes**

Stores learning outcomes and associated curriculum metadata such as grade, subject, and topic.

**Corpus documents**

Stores metadata about source curriculum documents, including document type and identifying information.

**Corpus chunks**

Stores searchable sections extracted from curriculum documents. Chunks retain source-entry identifiers and curriculum metadata and can be associated with embeddings for retrieval.

**Lesson plans**

Stores plan-level information such as title, creator, grade, subject, topic, status, current version, and timestamps.

**Lesson plan versions**

Stores versioned JSON lesson plan content and associated metadata, including version number, creator, status, and review information.

The separation between plan metadata and version content supports preserving previous versions as plans evolve.

## 7. Curriculum Corpus and Ingestion

The prototype uses a small synthetic curriculum corpus stored as JSON under `data/corpus/`.

The corpus includes examples of:

- Schemes of work
- Learning outcomes
- Sample assessments

Each JSON document represents a source document with structured curriculum information. The ingestion process transforms those documents into smaller, searchable chunks.

### Chunking approach

Chunks are based on meaningful curriculum entries, such as:

- An individual scheme-of-work entry
- A learning outcome
- An assessment item

This preserves useful context and makes it easier to trace generated content to its source.

### Ingestion process

1. Read JSON documents from the corpus directory.
2. Validate document structure.
3. Identify documents and source entries.
4. Extract meaningful chunks.
5. Prepare chunk content for retrieval and embedding generation.
6. Persist document metadata, chunks, and associated vectors.
7. Populate learning outcomes used by the planning interface.

The corpus is intentionally small to keep the prototype reproducible. It demonstrates the ingestion and retrieval workflow but does not provide comprehensive curriculum coverage.

## 8. Lesson Plan Schema

Generated lesson plans use a structured TypeScript/Zod schema instead of unstructured prose.

The schema contains:

- `title`
- `grade`
- `subject`
- `durationMinutes`
- `learningOutcome`
    - `outcomeId`
    - `outcomeText`
- `objectives`
- `materials`
- `starter`
    - `durationMinutes`
    - `teacherActions`
    - `learnerActions`
    - `sourceChunkIds`
- `mainActivities`
    - `title`
    - `durationMinutes`
    - `teacherActions`
    - `learnerActions`
    - `sourceChunkIds`
- `checkForUnderstanding`
    - `questions`
    - `sourceChunkIds`
- `conclusion`
    - `durationMinutes`
    - `teacherActions`
    - `sourceChunkIds`
- `assessment`
    - `method`
    - `successCriteria`
    - `sourceChunkIds`
- `sourceChunkIds`

The schema enforces required fields, positive durations, non-empty instructional content, and valid identifier formats.

### Persisted generation result

The generated content is stored as structured JSON:

```typescript
{
    groundingStatus: "grounded",
    plan: LessonPlan,
    sources: LessonPlanSource[]
}
```

The `plan` contains the lesson plan itself. The `sources` collection contains source metadata, and `sourceChunkIds` link plan sections to the supporting curriculum chunks.

Storing this structure in JSONB allows the lesson plan format to evolve without requiring a relational column for every instructional field.

## 9. How Generation Works

The generation workflow demonstrates how curriculum context can be used to create a structured lesson plan.

1. **Select a learning outcome:** The teacher chooses an outcome and lesson duration.
2. **Retrieve curriculum context:** The backend retrieves relevant curriculum chunks.
3. **Prepare the input:** The selected outcome, duration, and retrieved context are passed to the mock generation implementation.
4. **Generate a candidate:** The mock provider produces a lesson plan.
5. **Validate the structure:** The candidate is checked against the lesson plan schema.
6. **Validate source references:** Referenced chunk IDs are checked against the available sources.
7. **Retry invalid results:** Generation retries within a configured maximum number of attempts where applicable.
8. **Return the result:** A successful result includes the plan, grounding status, and source metadata.
9. **Allow editing:** The teacher can edit the generated plan.
10. **Save the plan:** The save service persists plan metadata and its initial version transactionally.

### What happens when generation fails?

If the mock provider produces invalid content, validation fails repeatedly, or source references cannot be verified, generation fails after the configured retry limit rather than returning an invalid result as grounded.

The UI should communicate the failure and allow the teacher to retry. Failed generation should not be saved as a successfully grounded lesson plan.

### What grounding means in this prototype

Grounding provides traceability between a generated plan and retrieved curriculum material. It does not guarantee that every instructional statement is correct or pedagogically appropriate. Source-reference checks and schema validation are not substitutes for human review.

## 10. Assumptions and Trade-offs

### Mock generation

Mock generation keeps the prototype independent of external APIs, avoids API costs, and makes local demonstrations easier.

**Trade-off:** It does not measure the quality, reliability, latency, or cost of real LLM-generated lesson plans.

**Possible extension:** Integrate a real LLM provider and evaluate generated plans against verified curriculum examples.

### Small synthetic corpus

A small JSON corpus makes ingestion and retrieval easy to demonstrate.

**Trade-off:** Retrieval quality and curriculum coverage are limited.

**Possible extension:** Expand the corpus using verified curriculum documents, document provenance, curriculum versions, and retrieval evaluation.

### JSONB plan content

JSONB supports flexible structured content and keeps each version together.

**Trade-off:** Querying individual instructional fields and migrating older versions becomes more complex as the schema changes.

**Possible extension:** Add content-schema versions and migration functions.

### Versioning

Separate lesson plan and version tables provide a foundation for preserving previous versions.

**Trade-off:** Concurrent editing, version comparison, and restoration need additional implementation.

**Possible extension:** Add optimistic concurrency control, version comparison, and restore-from-version functionality.

### Incomplete review workflow

The prototype demonstrates the Curriculum Lead interface but does not implement approval/rejection operations on the backend.

**Desired implementation:**

1. Teachers save drafts and submit them for review.
2. Draft plans are visible only to their creators.
3. Curriculum Leads review submitted plans.
4. Approving a plan updates its status to `approved`.
5. Clicking Reject reveals a comment input.
6. The Curriculum Lead provides a rejection reason and confirms the action.
7. The backend records the rejection status, comment, reviewer, and timestamp.
8. The teacher can see the review outcome and feedback.

The backend must enforce ownership, role permissions, and valid status transitions. Hiding or displaying buttons in the UI is not sufficient authorization.

### Limited development time

The project prioritizes demonstrating the core generation and persistence architecture over completing every user journey.

The teacher's dummy list and the Curriculum Lead's UI-only review actions are intentional known gaps, not evidence of a complete end-to-end workflow.

## 11. Future Extensions

Potential extensions include:

- Expand the corpus with verified curriculum material.
- Evaluate retrieval quality and generated-plan alignment.
- Add real LLM integration and provider-independent generation interfaces.
- Introduce token budgets, caching, request limits, and cost monitoring if a real provider is added.
- Improve retry handling and error classification.
- Add content-schema versioning and migration support.
- Complete teacher submission and Curriculum Lead review APIs.
- Implement rejection comments and reviewer audit history.
- Enforce server-side ownership and role-based authorization.
- Add automated tests for ingestion, generation validation, persistence, and permissions.
- Add version comparison, restoration, and concurrent-edit protection.

## 12. Security Notes

- Never commit `.env.local` or credentials.
- Use development-only demo accounts.
- Validate incoming API requests.
- Enforce permissions and ownership on the server.
- Do not treat client-provided grounding metadata as proof of grounding.
- Do not deploy development secrets or demo credentials to production.

## 13. Summary

The Curriculum Design Hub is a prototype demonstrating structured curriculum ingestion, context retrieval, mock lesson plan generation, schema validation, source traceability, editing, and versioned persistence.

The complete teacher-to-reviewer workflow remains unfinished. In particular, the teacher's list is still dummy data, and Curriculum Lead approval/rejection is not connected to backend operations. These are clear next steps toward a complete end-to-end curriculum planning application.
