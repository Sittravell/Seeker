
import { createSlice } from '@reduxjs/toolkit';
import { RecommendationApi } from '@/api';
import { fetchExploreResults, submitExploreInteraction } from './thunks';

interface ExploreState {
    queue: RecommendationApi.RecommendationResult[];
    loading: boolean;
    error: string | null;
}

const initialState: ExploreState = {
    queue: [],
    loading: false,
    error: null,
};

const exploreSlice = createSlice({
    name: 'explore',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Results
        builder.addCase(fetchExploreResults.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchExploreResults.fulfilled, (state, action) => {
            state.loading = false;
            // Filter duplicates
            const newItems = action.payload;
            const existingIds = new Set(state.queue.map(item => item.tmdbId));
            const distinctNewItems = newItems.filter((item: RecommendationApi.RecommendationResult) => !existingIds.has(item.tmdbId));
            state.queue = [...state.queue, ...distinctNewItems];
        });
        builder.addCase(fetchExploreResults.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(submitExploreInteraction.pending, (state) => {
        });
        builder.addCase(submitExploreInteraction.fulfilled, (state, action) => {
            state.queue = state.queue.filter(item => item.tmdbId !== action.payload.tmdbId);
        });
        builder.addCase(submitExploreInteraction.rejected, (state, action) => {
            console.error('Interaction failed:', action.payload);
        });
    },
});

export default exploreSlice.reducer;
