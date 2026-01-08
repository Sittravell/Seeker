
import { RecommendationApi } from '@/api';
import { createSlice } from '@reduxjs/toolkit';
import { fetchUserRecommendations } from './thunks';

interface RecommendationState {
    personal: RecommendationApi.RecommendationResult[];
    loading: boolean;
    error: string | null;
}

const initialState: RecommendationState = {
    personal: [],
    loading: false,
    error: null,
};

const recommendationSlice = createSlice({
    name: 'recommendations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserRecommendations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserRecommendations.fulfilled, (state, action) => {
                state.loading = false;
                state.personal = action.payload;
            })
            .addCase(fetchUserRecommendations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default recommendationSlice.reducer;
