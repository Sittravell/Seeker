import { backend } from "../backend/client";
import type { InteractionType } from "./models";

export const save = async (tmdbId: number, type: InteractionType, mediaType: 'MOVIE' | 'TV' = 'MOVIE') => {
    const response = await backend.post('/interactions', { tmdbId, type, mediaType });
    return response.data;
};

export const getList = async (tmdbId?: number, mediaType?: 'MOVIE' | 'TV') => {
    const params: any = {};
    if (tmdbId) params.tmdbId = tmdbId;
    if (mediaType) params.mediaType = mediaType;

    const response = await backend.get('/interactions', { params });
    return response.data;
};

