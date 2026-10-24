# AI_LOG.md

## AI-Assisted Development Log

### 1. Tools Used

**ChatGPT** was used throughout development as a coding assistant and technical sounding board. I used it to:

- Review the application architecture, including the Next.js App Router, feature-first frontend organisation, service/API separation, and database design.
- Develop and refine TypeScript types, Zod validation schemas, Drizzle ORM queries, database seeders, and API route implementations.
- Reason through curriculum corpus ingestion, chunking, source grounding, and structured lesson plan generation.
- Troubleshoot TypeScript errors, database connection issues, package installation failures, and Next.js rendering behaviour.

**Claude** was used to create the UIs.

I used the suggestions as a starting point, reviewing and adapting them to the actual codebase rather than treating generated code as authoritative.

### 2. AI Suggestions I Corrected

AI-generated code required several corrections before it aligned with the application's actual architecture and requirements:

- **API response contracts:** A lesson-plan listing query returned the creator's ID instead of their name. I changed the Drizzle query to join the `users` table and return `users.name`, matching what the frontend needed to display.
- **Request payloads:** An initial save implementation passed the lesson plan directly to the mutation, although the API expected a wrapper containing the plan, topic, source references, and grounding status. I aligned the mutation payload with the API contract.
- **Type safety:** Some suggestions confused the outer API response with the nested lesson plan content and did not account for nullable saved content. I corrected the types and added null checks before passing data to components.

### 3. A Decision I Made Independently

I deliberately chose PostgreSQL as the single database rather than combining PostgreSQL with MongoDB for curriculum chunks.

Although MongoDB could accommodate semi-structured curriculum documents, introducing a second database would increase operational complexity for a small prototype. PostgreSQL provides relational integrity for users, learning outcomes, and lesson plans, while JSONB supports structured curriculum content and `pgvector` provides a foundation for vector-based retrieval.

I prioritised simplicity and maintainability while retaining a path for future expansion.

I also deliberately limited the prototype's scope rather than implementing a complete approval workflow or integrating a live LLM under time constraints. This kept the focus on demonstrating structured generation, validation, source traceability, editing, and persistence.

### 4. How I Validated the Work

I used TypeScript checks, database migrations, seed scripts, and local execution to identify integration and implementation issues. I also examined API contracts, schema definitions, and persistence behaviour when troubleshooting errors.

The prototype remains incomplete in some areas, particularly the end-to-end teacher review workflow. I have documented these limitations rather than presenting planned functionality as finished.

Ultimately, AI accelerated implementation and helped explore alternatives, but I remained responsible for validating the code, selecting the scope, and understanding the trade-offs behind the submitted solution.