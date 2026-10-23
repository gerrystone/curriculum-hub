"use client";

import { useMutation } from "@tanstack/react-query";
import {LoginFormValues} from "@/features/authentication/validation";
import {authService} from "@/features/authentication/services/auth.service";

export function useLogin() {
    return useMutation({
        mutationKey: ["auth", "login"],
        mutationFn: (credentials: LoginFormValues) =>
            authService.login(credentials),
    });
}