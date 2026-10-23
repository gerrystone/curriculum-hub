const ACCESS_TOKEN_KEY = "accessToken";

export const accessTokenStorage = {
    get(): string | null {
        if (typeof window === "undefined") {
            return null;
        }

        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    set(token: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    clear(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    },
};