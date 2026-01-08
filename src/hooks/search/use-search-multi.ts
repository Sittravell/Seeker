
import { MovieApi, TvApi } from '@/api';
import { useState, useEffect } from 'react';
import type { SearchResultItem } from './search-result-item';

export const useSearchMulti = (query: string) => {
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }
        const fetch = async () => {
            setLoading(true);
            try {
                const [movies, tv] = await Promise.all([
                    MovieApi.search(query),
                    TvApi.search(query)
                ]);

                const combined: SearchResultItem[] = [
                    ...movies.results.map(m => ({ ...m, media_type: 'movie' as const })),
                    ...tv.results.map(t => ({ ...t, media_type: 'tv' as const }))
                ];

                // Sort by popularity desc
                combined.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

                setResults(combined);
            } catch (error) {
                console.error("Multi search error", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [query]);

    return { results, loading };
};
