import type { Movie } from "../movie/models";
import type { TVShow } from "../tv/models";

export interface Person {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    known_for: (Movie | TVShow)[];
}

export interface PersonImage {
    aspect_ratio: number;
    height: number;
    iso_639_1: string | null;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
}

export interface PersonImagesResponse {
    id: number;
    profiles: PersonImage[];
}

export interface PersonChanges {
    key: string;
    items: {
        id: string;
        action: string;
        time: string;
        iso_639_1: string;
        value: string;
        original_value: string;
    }[];
}


