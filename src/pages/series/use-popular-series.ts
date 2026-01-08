
import { useEffect, useState, useCallback } from 'react';
import { RecommendationApi, TvApi } from '@/api';

interface Props {
    page: number;
}
export default function usePopularSeries({ page }: Props) {
    const [series, setSeries] = useState<RecommendationApi.RecommendationResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const data = await TvApi.getPopular(page);

            if (page >= data.total_pages) {
                setHasMore(false);
            }

            const newSeries = data.results.map(t => ({
                tmdbId: t.id,
                title: t.name,
                overview: t.overview,
                poster_path: t.poster_path,
                score: t.popularity,
                mediaType: 'TV' as const
            }));

            setSeries(prev => {
                const existingIds = new Set(prev.map(i => `${i.mediaType}:${i.tmdbId}`));
                const uniqueNew = newSeries.filter(i => !existingIds.has(`${i.mediaType}:${i.tmdbId}`));
                return [...prev, ...uniqueNew];
            });

        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [setHasMore, setIsError, setIsLoading, TvApi.getPopular, setSeries, page])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        series,
        isLoading,
        isError,
        hasMore,
        fetch: fetchData
    }
};
