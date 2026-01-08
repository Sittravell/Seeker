import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthApi } from '@/api';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: AuthApi.LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await AuthApi.login(credentials);
            return response;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Login failed');
        }
    }
);
