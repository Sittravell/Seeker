import type { CreatedBy, Episode, Genre, Network, ProductionCompany, ProductionCountry, Season, SpokenLanguage } from "../tmdb/models";

export interface TVShow {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    first_air_date: string;
    name: string;
    vote_average: number;
    vote_count: number;
}

export interface TVShowDetails extends Omit<TVShow, 'genre_ids'> {
    created_by: CreatedBy[];
    episode_run_time: number[];
    genres: Genre[];
    homepage: string;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    last_episode_to_air: Episode | null;
    next_episode_to_air: Episode | null;
    networks: Network[];
    number_of_episodes: number;
    number_of_seasons: number;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    seasons: Season[];
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    type: string;
}