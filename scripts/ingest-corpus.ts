
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
    // Import after loading environment variables because the database
    // connection may be initialized when this module is imported.
    const { ingestCorpusDirectory } = await import(
        "@/backend/lib/ingest-corpus"
        );

    console.log("Starting curriculum corpus ingestion...");

    const report = await ingestCorpusDirectory();

    console.log("Ingestion completed.");
    console.dir(report, { depth: null });

    if (report.failures.length > 0) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error("Corpus ingestion failed:", error);
    process.exitCode = 1;
});
