
import { RecommendationApi } from '@/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserRecommendations = createAsyncThunk(
    'recommendations/fetchPersonal',
    async (_, { rejectWithValue }) => {
        try {
            const data = await RecommendationApi.getPersonalList();
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to fetch recommendations');
        }
    }
);
