import axios from "axios";
import { accessTokenStorage } from "@/features/authentication/utils/access-token";

export const apiClient = axios.create({
    baseURL: "/api",
    headers: {
        Accept: "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = accessTokenStorage.get();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});