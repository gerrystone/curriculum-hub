
import { createHash } from "node:crypto";

function canonicalize(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(canonicalize);
    }

    if (value !== null && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, item]) => [key, canonicalize(item)]),
        );
    }

    return value;
}

export function hashContent(value: unknown): string {
    const canonicalJson = JSON.stringify(canonicalize(value));

    return createHash("sha256")
        .update(canonicalJson, "utf8")
        .digest("hex");
}

export function createChunkId(
    documentId: string,
    sourceEntryId: string,
): string {
    return createHash("sha256")
        .update(`${documentId}:${sourceEntryId}`, "utf8")
        .digest("hex");
}
