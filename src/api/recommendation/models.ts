
export interface RecommendationResult {
    tmdbId: number;
    title: string;
    overview: string | null;
    poster_path: string | null;
    score?: number;
    mediaType?: 'MOVIE' | 'TV';
}

export interface RecommendationResponse {
    results: RecommendationResult[];
}
