export type LoginResponse  = {
    name: string;
    role: "teacher" | "curriculum_lead";
    token: string;
    tokenType: string;
    expiresAt: string;
}