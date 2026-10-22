
import "server-only";

import { createHash } from "node:crypto";

export const EMBEDDING_DIMENSIONS = 1536;

export interface EmbeddingProvider {
    model: string;

    embedMany(texts: string[]): Promise<number[][]>;
}

function createMockEmbedding(text: string): number[] {
    const values: number[] = [];
    let counter = 0;

    while (values.length < EMBEDDING_DIMENSIONS) {
        const hash = createHash("sha256")
            .update(`${text}:${counter}`)
            .digest();

        for (let offset = 0; offset < hash.length; offset += 4) {
            if (values.length >= EMBEDDING_DIMENSIONS) {
                break;
            }

            const integer = hash.readUInt32BE(offset);

            // Map the unsigned integer to a value between -1 and 1.
            values.push((integer / 0xffffffff) * 2 - 1);
        }

        counter++;
    }

    // Normalize the vector to unit length.
    const magnitude = Math.sqrt(
        values.reduce((sum, value) => sum + value * value, 0),
    );

    return values.map((value) => value / magnitude);
}

export const embeddingProvider: EmbeddingProvider = {
    model: "mock-v1",

    async embedMany(texts: string[]): Promise<number[][]> {
        return texts.map(createMockEmbedding);
    },
};
