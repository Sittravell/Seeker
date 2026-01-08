import { backend } from "../backend/client";
import type { AuthResponse, LoginCredentials, RegisterCredentials } from "./models";

export const login = async (credentials: LoginCredentials) => {
    const response = await backend.post<AuthResponse>('/auth/login', credentials);
    return response.data;
};

export const register = async (credentials: RegisterCredentials) => {
    const response = await backend.post<{ message: string }>('/auth/register', credentials);
    return response.data;
};
