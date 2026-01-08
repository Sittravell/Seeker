
import { useCallback, useEffect, useState } from 'react';
import { MovieApi, TvApi } from '@/api';
import type { TitleDetail, TitleMediaType } from './models';

interface Props {
    tmdbId: number;
    mediaType: TitleMediaType;
}


export default function UseContentDetails({
    tmdbId,
    mediaType
}: Props) {
    const [details, setDetails] = useState<TitleDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        try {
            // Fetch Details
            let data;
            if (mediaType === 'MOVIE') {
                const movieData = await MovieApi.getDetails(tmdbId);
                data = movieData;
            } else {
                const tvData = await TvApi.getDetails(tmdbId);
                data = {
                    ...tvData,
                    title: tvData.name,
                    release_date: tvData.first_air_date
                };
            }
            setDetails(data);
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [tmdbId, mediaType]);

    useEffect(() => {
        if (tmdbId) {
            fetchAll();
        }
    }, [fetchAll]);

    return {
        fetch: fetchAll,
        details,
        isLoading,
        isError,
    };
}