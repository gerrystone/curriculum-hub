export type UserRole = "teacher" | "curriculum_lead";

export type LoginResponse  = {
    name: string;
    role: UserRole;
    token: string;
    tokenType: string;
    expiresAt: string;
    accessToken: string;
}

export type AuthUser  = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}
export  type AuthSessionResponse =  {
    user?: AuthUser;
    expires?: string;
}
