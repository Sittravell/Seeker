
export interface TitleDetail {
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    genres: { id: number; name: string }[];
}

export type TitleMediaType = "MOVIE" | "TV";

