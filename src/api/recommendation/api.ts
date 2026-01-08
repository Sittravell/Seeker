import { backend } from "../backend/client";
import type { RecommendationResponse } from "./models";

export const getDiscoveryList = async () => {
    const response = await backend.get<RecommendationResponse>('/recommend/discovery');
    return response.data.results;
};

export const getPersonalList = async () => {
    const response = await backend.get<RecommendationResponse>('/recommend/personal');
    return response.data.results;
};
