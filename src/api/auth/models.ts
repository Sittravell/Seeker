export interface LoginCredentials {
    identifier: string; // Changed from email to identifier
    password: string;
}

export interface RegisterCredentials {
    username: string; // Added username
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    userId: number;
    username: string;
    profilePicture?: string;
}