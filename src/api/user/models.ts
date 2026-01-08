
export interface UpdateProfileData {
    username: string;
}

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    profilePicture?: string;
    createdAt: string;
}
