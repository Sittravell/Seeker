import { tmdb } from "../tmdb/client";
import type { PaginatedResponse } from "../tmdb/models";
import type { Movie, MovieDetails } from "./models";

export const getPopular = async (page = 1) => {
    const response = await tmdb.get<PaginatedResponse<Movie>>('/movie/popular', {
        params: { page },
    });
    return response.data;
};

export const search = async (query: string, page = 1) => {
    const response = await tmdb.get<PaginatedResponse<Movie>>('/search/movie', {
        params: { query, page },
    });
    return response.data;
};

export const getDetails = async (movieId: number) => {
    const response = await tmdb.get<MovieDetails>(`/movie/${movieId}`);
    return response.data;
};
