import { backend } from "../backend/client";
import type { UpdateProfileData, UserProfile } from "./models";

export const getProfile = async () => {
    const response = await backend.get<UserProfile>('/user/profile');
    return response.data;
};

export const updateProfile = async (data: UpdateProfileData) => {
    const response = await backend.put<UserProfile>('/user/profile', data);
    return response.data;
};

export const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    // Explicitly set Content-Type header to undefined to let browser set it with boundary
    // OR create an instance with custom config
    const response = await backend.post<UserProfile>('/user/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const clearUserData = async () => {
    const response = await backend.delete('/user/data');
    return response.data;
};
