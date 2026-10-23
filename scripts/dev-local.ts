
import "dotenv/config";
import { spawn } from "node:child_process";

type CommandResult = {
    command: string;
    args: string[];
};

function runCommand({ command, args }: CommandResult): Promise<void> {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: "inherit",
            shell: process.platform === "win32",
            env: process.env,
        });

        child.on("error", reject);

        child.on("exit", (code, signal) => {
            if (code === 0) {
                resolve();
                return;
            }

            reject(
                new Error(
                    `${command} ${args.join(" ")} failed ` +
                    `(exit code: ${code ?? signal ?? "unknown"}).`,
                ),
            );
        });
    });
}

async function main(): Promise<void> {
    console.log("\nStarting Docker Compose services...");

    await runCommand({
        command: "docker",
        args: [
            "compose",
            "--env-file",
            ".env.local",
            "up",
            "-d",
            "--wait",
            "postgres",
        ],
    });

    console.log("\nApplying database migrations...");
    await runCommand({
        command: "npm",
        args: ["run", "db:migrate"],
    });

    console.log("\nIngesting curriculum corpus...");
    await runCommand({
        command: "npm",
        args: ["run", "db:ingestion"],
    });

    console.log("\nSeeding demo users and required data...");
    await runCommand({
        command: "npm",
        args: ["run", "db:seed"],
    });

    console.log("\nStarting Next.js...");
    await runCommand({
        command: "npm",
        args: ["run", "dev"],
    });
}

main().catch((error: unknown) => {
    console.error("\nLocal development setup failed.");
    console.error(error);
    process.exitCode = 1;
});
