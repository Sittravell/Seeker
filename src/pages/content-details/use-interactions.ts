
import { useCallback, useEffect, useState } from 'react';
import { InteractionApi } from '@/api';
import type { TitleMediaType } from './models';

interface Props {
    tmdbId: number;
    mediaType: TitleMediaType;
}

export default function UseInteractions({
    tmdbId,
    mediaType
}: Props) {

    const [interaction, setInteraction] = useState<string | null>(null);
    const [isListLoading, setIsListLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isListError, setIsListError] = useState(false);
    const [isSaveError, setIsSaveError] = useState(false);

    const fetchAll = useCallback(async () => {
        setIsListLoading(true);
        try {
            const interactions = await InteractionApi.getList(tmdbId, mediaType);

            if (interactions.length > 0) {
                setInteraction(interactions[0].type);
            }
        } catch (error) {
            setIsListError(true);
        } finally {
            setIsListLoading(false);
        }
    }, [tmdbId, mediaType])

    useEffect(() => {
        if (tmdbId) {
            fetchAll();
        }
    }, [tmdbId, fetchAll]);

    const saveInteraction = useCallback(async (type: 'LIKE' | 'DISLIKE' | 'WANT' | 'NOT_WANT') => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            await InteractionApi.save(tmdbId, type, mediaType);
            setInteraction(type);
        } catch (error) {
            setIsSaveError(true);
        } finally {
            setIsSaving(false);
        }
    }, [isSaving, tmdbId, mediaType]);

    return {
        fetch: fetchAll,
        interaction,
        isListLoading,
        isSaving,
        isListError,
        isSaveError,
        saveInteraction
    }
}