
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RecommendationApi, InteractionApi } from '@/api';

export const fetchExploreResults = createAsyncThunk(
    'explore/fetchResults',
    async (_, { rejectWithValue }) => {
        try {
            const results = await RecommendationApi.getDiscoveryList();
            return results;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
        }
    }
);

export const submitExploreInteraction = createAsyncThunk(
    'explore/submitInteraction',
    async ({ tmdbId, type, mediaType }: { tmdbId: number; type: InteractionApi.InteractionType; mediaType: 'MOVIE' | 'TV' }, { rejectWithValue }) => {
        try {
            await InteractionApi.save(tmdbId, type, mediaType);
            return { tmdbId, type };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to save interaction');
        }
    }
);
