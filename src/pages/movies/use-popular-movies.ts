
import { useEffect, useState, useCallback } from 'react';
import { MovieApi, RecommendationApi } from '@/api';

interface Props {
    page: number;
}
export default function usePopularMovies({ page }: Props) {
    const [movies, setMovies] = useState<RecommendationApi.RecommendationResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const data = await MovieApi.getPopular(page);

            if (page >= data.total_pages) {
                setHasMore(false);
            }

            const newMovies = data.results.map(m => ({
                tmdbId: m.id,
                title: m.title,
                overview: m.overview,
                poster_path: m.poster_path,
                score: m.popularity,
                mediaType: 'MOVIE' as const
            }));

            setMovies(prev => {
                const existingIds = new Set(prev.map(i => `${i.mediaType}:${i.tmdbId}`));
                const uniqueNew = newMovies.filter(i => !existingIds.has(`${i.mediaType}:${i.tmdbId}`));
                return [...prev, ...uniqueNew];
            });

        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [setHasMore, setIsError, setIsLoading, MovieApi.getPopular, setMovies, page])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        movies,
        isLoading,
        isError,
        hasMore,
        fetch: fetchData
    }
};
