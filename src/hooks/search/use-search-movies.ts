
import { MovieApi } from '@/api';
import { useState, useEffect } from 'react';

export const useSearchMovies = (query: string) => {
    const [results, setResults] = useState<MovieApi.Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await MovieApi.search(query);
                setResults(data.results);
            } catch (error) {
                console.error("Movie search error", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [query]);

    return { results, loading };
};
