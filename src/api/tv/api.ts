import { tmdb } from "../tmdb/client";
import type { PaginatedResponse } from "../tmdb/models";
import type { TVShow, TVShowDetails } from "./models";

export const getPopular = async (page = 1) => {
    const response = await tmdb.get<PaginatedResponse<TVShow>>('/tv/popular', {
        params: { page },
    });
    return response.data;
};

export const getDetails = async (tvId: number) => {
    const response = await tmdb.get<TVShowDetails>(`/tv/${tvId}`);
    return response.data;
};

export const search = async (query: string, page = 1) => {
    const response = await tmdb.get<PaginatedResponse<TVShow>>('/search/tv', {
        params: { query, page },
    });
    return response.data;
};
