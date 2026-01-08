import { tmdb } from "../tmdb/client";
import type { PaginatedResponse, TimeWindow } from "../tmdb/models";
import type { Person, PersonChanges, PersonImagesResponse } from "./models";

export const getTrending = async (timeWindow: TimeWindow = 'day') => {
    const response = await tmdb.get<PaginatedResponse<Person>>(`/trending/person/${timeWindow}`);
    return response.data;
};

export const getChanges = async (personId: number, page = 1) => {
    const response = await tmdb.get<PersonChanges>(`/person/${personId}/changes`, {
        params: { page }
    });
    return response.data;
}

export const getImages = async (personId: number) => {
    const response = await tmdb.get<PersonImagesResponse>(`/person/${personId}/images`);
    return response.data;
}
