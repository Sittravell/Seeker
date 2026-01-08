
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserApi } from '@/api';

export const fetchUserProfile = createAsyncThunk(
    'user/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            return await UserApi.getProfile();
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch profile');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (updateData: UserApi.UpdateProfileData, { rejectWithValue }) => {
        try {
            return await UserApi.updateProfile(updateData);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to update profile');
        }
    }
);

export const uploadUserAvatar = createAsyncThunk(
    'user/uploadUserAvatar',
    async (file: File, { rejectWithValue }) => {
        try {
            return await UserApi.uploadAvatar(file);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to upload avatar');
        }
    }
);
