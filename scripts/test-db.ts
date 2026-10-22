
import "dotenv/config";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: true });

async function testDatabaseConnection() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL is missing from .env.local");
    }

    const pool = new Pool({ connectionString });

    try {
        const result = await pool.query(`
            SELECT
                current_database() AS database,
                current_user AS username,
                version() AS version
        `);

        console.log("Database connection successful!");
        console.log(result.rows[0]);
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

testDatabaseConnection();
