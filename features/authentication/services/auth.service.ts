
import {LoginFormValues} from "@/features/authentication/validation";
import {AuthSessionResponse, AuthUser, LoginResponse} from "@/features/authentication/types";
import {apiClient} from "@/app/lib/api-client";
import axios from "axios";


export const authService = {
    async  login(credentials: LoginFormValues,): Promise<LoginResponse> {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data: unknown = await response.json();

        if (!response.ok) {
            const message =
                typeof data === "object" &&
                data !== null &&
                "message" in data &&
                typeof data.message === "string"
                    ? data.message
                    : "Login failed";

            throw new Error(message);
        }

        return data as LoginResponse;

    },
    async getCurrentUser(): Promise<AuthUser | null> {
        try {
            const response = await apiClient.get<{ user: AuthUser | null }>(
                "/auth/me",
            );

            return response.data.user;
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 401
            ) {
                return null;
            }

            throw new Error("Failed to retrieve current user", {
                cause: error,
            });
        }
    }
}
