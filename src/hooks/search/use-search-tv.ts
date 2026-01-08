
import { TvApi } from '@/api';
import { useState, useEffect } from 'react';

export const useSearchTV = (query: string) => {
    const [results, setResults] = useState<TvApi.TVShow[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await TvApi.search(query);
                setResults(data.results);
            } catch (error) {
                console.error("TV search error", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [query]);

    return { results, loading };
};
