
import { describe, expect, it } from "vitest";
import {hasRequiredRole} from "@/backend/services/user-service";

describe("hasRequiredRole", () => {
    it("allows a Curriculum Lead to approve plans", () => {
        expect(
            hasRequiredRole("curriculum_lead", ["curriculum_lead"]),
        ).toBe(true);
    });

    it("denies a teacher permission to approve plans", () => {
        expect(
            hasRequiredRole("teacher", ["curriculum_lead"]),
        ).toBe(false);
    });

    it("denies a role not explicitly allowed", () => {
        expect(
            hasRequiredRole("teacher", []),
        ).toBe(false);
    });
});
