import {queryOptions, useQuery} from "@tanstack/react-query";
import {authService} from "@/features/authentication/services/auth.service";
import { AuthUser} from "@/features/authentication/types";

export const useCurrentUser = () => {
    return useQuery<AuthUser | null>({
        queryKey: ["current-user"],
        queryFn: authService.getCurrentUser,
        staleTime: 60_000,
        retry: 1,
    });
};