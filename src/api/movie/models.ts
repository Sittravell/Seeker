import type { Genre, ProductionCompany, ProductionCountry, SpokenLanguage } from "../tmdb/models";

export interface Movie {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
    belongs_to_collection: null | object;
    budget: number;
    genres: Genre[];
    homepage: string | null;
    imdb_id: string | null;
    origin_country: string[];
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    revenue: number;
    runtime: number | null;
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string | null;
}