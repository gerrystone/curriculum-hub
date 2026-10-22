
import "dotenv/config";
import {ingestCorpusDirectory} from "@/backend/lib/ingest-corpus";

async function main() {
    console.log("Starting curriculum corpus ingestion...");

    const report = await ingestCorpusDirectory();

    console.log("Ingestion completed.");
    console.dir(report, { depth: null });
}

main().catch((error) => {
    console.error("Corpus ingestion failed:", error);
    process.exitCode = 1;
});
