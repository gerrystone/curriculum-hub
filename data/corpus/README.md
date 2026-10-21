# Synthetic Grade 8 Integrated Science Corpus

## 1. Purpose and limitations

This directory contains a **fully synthetic mock curriculum corpus** for Grade 8 Integrated Science. It exists only to build and test the Curriculum Design Hub prototype: ingestion, chunking, embedding, retrieval and grounded lesson-plan generation.

**Important limitations**

- The content is **not** official Nova Pioneer curriculum material and must not be presented as such. Every document title carries the suffix "(Synthetic Mock Corpus)".
- The documents are short and focused. They are not textbooks and do not give full coverage of a Grade 8 syllabus.
- The science is written to be accurate for introductory secondary level (for example, g is rounded to 10 N/kg, and efficiency and energy-store models are simplified). It has not been reviewed by a subject specialist, so do not use it for real teaching or assessment without review.
- Week numbers (1 to 18), durations and sequencing are invented for demonstration.
- The corpus contains **no embeddings** or vector values. Embeddings are generated programmatically during ingestion.
- This task produced source documents only. There are no lesson plans, embedding code, API routes or UI.

## 2. Documents

Exactly 10 source files, one JSON document each (UTF-8, 2-space indentation):

| File | `documentType` | Title | Contents | Topic area |
|---|---|---|---|---|
| `AS-01.json` | `sample_assessment` | Grade 8 Integrated Science Sample Assessment: Cells, Matter and Forces | 9 `items` | Cells and organisation; Forces and motion; Matter and the particle model |
| `AS-02.json` | `sample_assessment` | Grade 8 Integrated Science Sample Assessment: Ecosystems, Energy and Circuits | 9 `items` | Ecosystems and interdependence; Energy transfer; Simple electrical circuits |
| `LO-01.json` | `learning_outcomes` | Grade 8 Integrated Science Learning Outcomes: Cells, Matter and Forces | 9 `outcomes` | Cells and organisation; Forces and motion; Matter and the particle model |
| `LO-02.json` | `learning_outcomes` | Grade 8 Integrated Science Learning Outcomes: Ecosystems, Energy and Circuits | 9 `outcomes` | Ecosystems and interdependence; Energy transfer; Simple electrical circuits |
| `SW-01.json` | `scheme_of_work` | Grade 8 Integrated Science Scheme of Work: Cells and Organisation | 3 `entries` | Cells and organisation |
| `SW-02.json` | `scheme_of_work` | Grade 8 Integrated Science Scheme of Work: Matter and the Particle Model | 3 `entries` | Matter and the particle model |
| `SW-03.json` | `scheme_of_work` | Grade 8 Integrated Science Scheme of Work: Forces and Motion | 3 `entries` | Forces and motion |
| `SW-04.json` | `scheme_of_work` | Grade 8 Integrated Science Scheme of Work: Ecosystems and Interdependence | 3 `entries` | Ecosystems and interdependence |
| `SW-05.json` | `scheme_of_work` | Grade 8 Integrated Science Scheme of Work: Energy Transfer | 3 `entries` | Energy transfer |
| `SW-06.json` | `scheme_of_work` | Grade 8 Integrated Science Scheme of Work: Simple Electrical Circuits | 3 `entries` | Simple electrical circuits |

Topic coverage across the schemes of work, with one main topic per scheme, is: `SW-01` cells and organisation, `SW-02` matter and the particle model, `SW-03` forces and motion, `SW-04` ecosystems and interdependence, `SW-05` energy transfer and `SW-06` simple electrical circuits. Each scheme has 3 entries covering teaching weeks 1 to 18 across the six schemes (3 weeks each).

### Alignment between documents

Each of the 18 scheme entries has exactly one matching learning outcome and exactly one matching assessment item. All three use the **identical `topic` string** (for example `Cells and organisation: Observing cells with a light microscope`). Retrieval can therefore be filtered or grouped by `topic`. Topic strings always start with one of the six main topic names followed by a colon and a lesson-level subtopic. Identifier codes embed the main topic: `CEL`, `MAT`, `FOR`, `ECO`, `ENE`, `CIR`.

| Main topic | Scheme entries | Learning outcomes | Assessment items |
|---|---|---|---|
| Cells and organisation | `SW-01-W01` to `W03` | `LO-CEL-01` to `03` | `AS-CEL-01` to `03` |
| Matter and the particle model | `SW-02-W04` to `W06` | `LO-MAT-01` to `03` | `AS-MAT-01` to `03` |
| Forces and motion | `SW-03-W07` to `W09` | `LO-FOR-01` to `03` | `AS-FOR-01` to `03` |
| Ecosystems and interdependence | `SW-04-W10` to `W12` | `LO-ECO-01` to `03` | `AS-ECO-01` to `03` |
| Energy transfer | `SW-05-W13` to `W15` | `LO-ENE-01` to `03` | `AS-ENE-01` to `03` |
| Simple electrical circuits | `SW-06-W16` to `W18` | `LO-CIR-01` to `03` | `AS-CIR-01` to `03` |

Within each topic, the first entry/outcome/item aligns with the first lesson of that topic, and so on in order.

## 3. JSON schemas

### Common fields (all documents)

| Field | Type | Meaning |
|---|---|---|
| `documentId` | string | Unique document identifier; matches the filename (`SW-01`, `LO-01`, `AS-01`, ...). |
| `documentType` | string | `scheme_of_work`, `learning_outcomes` or `sample_assessment`. |
| `title` | string | Descriptive title, suffixed "(Synthetic Mock Corpus)". |
| `subject` | string | Always `Integrated Science`. |
| `grade` | integer | Always `8`. |
| `version` | integer | Document version, initially `1`. Increment when content changes so that re-ingestion can detect updates. |

### A. Scheme of work (`entries[]`)

| Field | Type | Meaning |
|---|---|---|
| `entryId` | string | Identifier unique within the document (`W01`, `W02`, ...). The week-based code is stable and combined with the `documentId` in chunk IDs. |
| `week` | integer | Teaching week number (1 to 18 across the six schemes). |
| `topic` | string | Topic title for the lesson, starting with the main topic name. |
| `durationMinutes` | integer | Planned lesson duration. |
| `priorKnowledge` | string[] | Prerequisite knowledge or skills. |
| `learningOutcomes` | string[] | Intended outcomes for the lesson. |
| `keyConcepts` | string[] | Important scientific ideas and vocabulary. |
| `learningActivities` | string[] | Practical teaching and learning activities. |
| `resources` | string[] | Teaching resources and equipment. |
| `assessment` | string | Formative assessment prompt. |
| `teacherNotes` | string | Guidance, safety notes and anticipated difficulties. |

### B. Learning outcomes (`outcomes[]`)

| Field | Type | Meaning |
|---|---|---|
| `outcomeId` | string | Unique outcome ID, for example `LO-CEL-01`. Unique across both learning-outcomes documents. |
| `topic` | string | Associated curriculum topic (same string as the matching scheme entry). |
| `statement` | string | Measurable learning outcome. |
| `successCriteria` | string[] | Observable criteria for judging achievement. |
| `evidenceOfLearning` | string[] | Evidence a teacher could collect. |
| `commonMisconception` | string | A likely learner misconception. |

### C. Sample assessment (`items[]`)

| Field | Type | Meaning |
|---|---|---|
| `itemId` | string | Unique item ID, for example `AS-CEL-01`. Unique across both assessment documents. |
| `topic` | string | Associated topic (same string as the matching scheme entry). |
| `itemType` | string | `multiple_choice`, `short_response`, `explanation` or `application`. |
| `difficulty` | string | `foundational`, `developing` or `advanced`. |
| `question` | string | The assessment question, self-contained. |
| `expectedAnswer` | string | The correct answer or the marking points. |
| `marks` | integer | Maximum marks. |
| `markingGuide` | string[] | How marks are awarded. Each line starts with `N mark(s):` and the lines sum to `marks`. |
| `misconceptionTested` | string | The misconception the item is designed to reveal. |

## 4. Recommended chunking strategy

| Document type | Chunk unit | Chunks in this corpus |
|---|---|---|
| Schemes of work | one chunk per `entries[]` item | 18 |
| Learning outcomes | one chunk per `outcomes[]` item | 18 |
| Assessments | one chunk per `items[]` item | 18 |

Total: **54 chunks**. Each entry already contains the topic, concepts and context it needs, so no cross-entry context or overlap windows are required.

### Chunk metadata

Each chunk should preserve:

| Field | Value |
|---|---|
| `chunkId` | Deterministic ID (see below). |
| `documentId` | From the parent document. |
| `documentType` | From the parent document. |
| `title` | From the parent document. |
| `grade` | From the parent document. |
| `subject` | From the parent document. |
| `topic` | From the entry, outcome or item. |
| `sourceReference` | Pointer to the exact source entry (see below). |
| `content` | Readable consolidated text built from the entry's fields (not raw JSON). |

### Deterministic identifiers

`chunkId = <documentId>-<entryId | outcomeId | itemId>`

| Source | Example `chunkId` |
|---|---|
| Scheme entry | `SW-01-W01` |
| Learning outcome | `LO-01-LO-CEL-01` |
| Assessment item | `AS-01-AS-CEL-01` |

Identifiers depend only on IDs written in the source files, not on array position, so re-ordering or inserting entries does not change existing chunk IDs.

### Source references

`sourceReference = <documentId>.json::<array>[<idField>=<id>]`

| Chunk | `sourceReference` |
|---|---|
| `SW-01-W01` | `SW-01.json::entries[entryId=W01]` |
| `LO-01-LO-CEL-01` | `LO-01.json::outcomes[outcomeId=LO-CEL-01]` |
| `AS-01-AS-CEL-01` | `AS-01.json::items[itemId=AS-CEL-01]` |

The application can parse the reference, open `data/corpus/<documentId>.json`, and locate the entry whose ID field equals the given value.

### Content templates

Each `content` string starts with a plain-language label naming the type and topic and then lists the fields as labelled lines, joined with semicolons for arrays:

- **Scheme entry:** topic, week and duration, prior knowledge, learning outcomes, key concepts, learning activities, resources, formative assessment, teacher notes.
- **Learning outcome:** topic, outcome statement, success criteria, evidence of learning, common misconception.
- **Assessment item:** topic, type, difficulty, marks, question, expected answer, marking guide, misconception tested.

### Example chunks

`SW-01-W01`:

```json
{
  "chunkId": "SW-01-W01",
  "documentId": "SW-01",
  "documentType": "scheme_of_work",
  "title": "Grade 8 Integrated Science Scheme of Work: Cells and Organisation (Synthetic Mock Corpus)",
  "grade": 8,
  "subject": "Integrated Science",
  "topic": "Cells and organisation: Observing cells with a light microscope",
  "sourceReference": "SW-01.json::entries[entryId=W01]",
  "content": "Scheme of work entry for Grade 8 Integrated Science. Topic: Cells and organisation: Observing cells with a light microscope. Week 1, 80 minutes.\nPrior knowledge: Living things are made of smaller parts called cells; Safe handling of glass slides and laboratory equipment.\nLearning outcomes: Identify the parts of a light microscope and state the function of each; Prepare a wet-mount slide of onion epidermis and focus it first on low power and then on high power; Produce a labelled biological drawing of observed cells and calculate total magnification.\nKey concepts: cell as the basic unit of life; light microscope parts: eyepiece lens, objective lenses, stage, light source, coarse and fine focus wheels; total magnification = eyepiece magnification x objective magnification; biological drawing conventions: title, single clear lines, no shading, labels.\nLearning activities: Teacher demonstrates the parts of a light microscope using a real microscope or a projected labelled diagram; Learners work in pairs to prepare a wet-mount slide of onion epidermis stained with iodine solution, lowering the coverslip at an angle to avoid air bubbles; Learners focus on low power first, then switch to high power and use only the fine focus wheel; Learners make a pencil drawing of three or four neighbouring cells with a title, labels and the total magnification calculated.\nResources: Light microscopes (one per pair); Onion bulb, iodine solution, droppers, forceps, glass slides and coverslips; Labelled microscope diagram handout; Plain paper, sharp pencils and rulers.\nFormative assessment: Exit ticket: Name the part of the microscope that makes the image sharper, and calculate the total magnification when the eyepiece lens is x10 and the objective lens is x40.\nTeacher notes: Learners often start on high power and break slides, so insist on low-power focusing first. If microscopes are limited, use rotating stations with projected images or printed micrographs. Learners tend to shade and colour drawings; remind them that biological drawings use clear single lines. Iodine stains skin and clothing, so supervise handling."
}
```

`LO-01-LO-CEL-01`:

```json
{
  "chunkId": "LO-01-LO-CEL-01",
  "documentId": "LO-01",
  "documentType": "learning_outcomes",
  "title": "Grade 8 Integrated Science Learning Outcomes: Cells, Matter and Forces (Synthetic Mock Corpus)",
  "grade": 8,
  "subject": "Integrated Science",
  "topic": "Cells and organisation: Observing cells with a light microscope",
  "sourceReference": "LO-01.json::outcomes[outcomeId=LO-CEL-01]",
  "content": "Learning outcome for Grade 8 Integrated Science. Topic: Cells and organisation: Observing cells with a light microscope.\nOutcome: Learners use a light microscope correctly to observe plant cells, calculate total magnification and produce an accurate labelled biological drawing.\nSuccess criteria: Names the eyepiece, objective lens, stage, light source and focus wheels and states the function of each; Focuses a slide on low power before switching to high power; Calculates total magnification by multiplying eyepiece and objective magnifications; Produces a drawing with a title, single clear lines, labels and magnification.\nEvidence of learning: Teacher observation checklist during the practical; Labelled biological drawing; Exit ticket with a magnification calculation.\nCommon misconception: Learners often add the lens magnifications instead of multiplying them and start focusing on high power."
}
```

`AS-01-AS-CEL-01`:

```json
{
  "chunkId": "AS-01-AS-CEL-01",
  "documentId": "AS-01",
  "documentType": "sample_assessment",
  "title": "Grade 8 Integrated Science Sample Assessment: Cells, Matter and Forces (Synthetic Mock Corpus)",
  "grade": 8,
  "subject": "Integrated Science",
  "topic": "Cells and organisation: Observing cells with a light microscope",
  "sourceReference": "AS-01.json::items[itemId=AS-CEL-01]",
  "content": "Sample assessment item for Grade 8 Integrated Science. Topic: Cells and organisation: Observing cells with a light microscope. Type: multiple_choice. Difficulty: foundational. Marks: 1.\nQuestion: A learner views onion cells using a x10 eyepiece lens and a x40 objective lens. What is the total magnification? A) x4  B) x50  C) x400  D) x4000\nExpected answer: C) x400. Total magnification = eyepiece magnification x objective magnification = 10 x 40 = 400.\nMarking guide: 1 mark: selects C (x400).\nMisconception tested: Adding the magnifications of the two lenses instead of multiplying them (the x50 option)."
}
```

## 5. How the corpus will be used

1. **Load.** A TypeScript ingestion script reads every `data/corpus/*.json` file and validates it against the schemas above.
2. **Normalise.** The script turns each entry, outcome or item into a chunk using the templates and identifiers above, preserving the metadata fields.
3. **Embed.** The script generates embeddings from each chunk's `content` and stores the vector, `content` and metadata in the vector index. Embeddings are never stored in these source files.
4. **Retrieve.** When a teacher requests a lesson plan for a topic, the application embeds the request and retrieves the nearest chunks, optionally filtered by `topic`, `documentType` or `grade`. It should retrieve scheme entries (activities and notes), learning outcomes (success criteria and misconceptions) and assessment items together so they remain aligned.
5. **Generate with citations.** The retrieved chunks are supplied to the lesson-plan generator. Generated plans should cite the `chunkId` and `sourceReference` of the chunks they used, so teachers can trace the plan back to the exact entry, outcome or item.
6. **Re-ingest.** When a document changes, increment `version` and re-run ingestion. Because chunk IDs are deterministic, existing vectors can be replaced (upserted) rather than duplicated.

## 6. Validation performed

The files were checked with an automated script before delivery:

- All 10 files parse as valid UTF-8 JSON and exactly 10 JSON source files exist.
- Every document has `subject` = `Integrated Science`, `grade` = 8, `version` = 1, and a `documentId` matching its filename.
- Every document, scheme entry, learning outcome, assessment item and derived chunk identifier is unique within its namespace.
- All documents follow the schemas above (exact field set and field types, no empty fields).
- Every scheme topic has one learning outcome and one assessment item with an identical topic string, and identifier codes match the topic.
- Assessment `markingGuide` marks sum to `marks` for all items, and the numerical expected answers were recomputed.
- No chunk content relies on phrases such as "as mentioned above".
