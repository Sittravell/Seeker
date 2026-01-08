import type { InteractionApi } from '@/api';
import type { RecommendationResult } from '@/api/recommendation';
import { useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ExploreStore, Store } from '@/store';

interface Props {
    currentTitle: RecommendationResult;
}

export default function UseInteractionHandler({ currentTitle }: Props) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const dispatch = useDispatch<Store.AppDispatch>();

    const handleInteraction = useCallback(async (type: InteractionApi.InteractionType) => {
        if (!currentTitle) return;

        x.set(0);
        y.set(0);

        try {
            await dispatch(ExploreStore.submitExploreInteraction({
                tmdbId: currentTitle.tmdbId,
                type,
                mediaType: currentTitle.mediaType || 'MOVIE'
            })).unwrap();
        } catch (error) {
            console.error(`Failed to save interaction ${type}`, error);
        }
    }, [dispatch, currentTitle]);

    const handleDragEnd = useCallback(async (_: any, info: PanInfo) => {
        const threshold = 100;
        const { x: offsetX, y: offsetY } = info.offset;

        if (Math.abs(offsetY) > Math.abs(offsetX)) {
            if (offsetY < -threshold) {
                await handleInteraction('LIKE');
            } else if (offsetY > threshold) {
                await handleInteraction('DISLIKE');
            }
        } else {
            if (offsetX > threshold) {
                await handleInteraction('WANT');
            } else if (offsetX < -threshold) {
                await handleInteraction('NOT_WANT');
            }
        }
    }, [handleInteraction]);

    return {
        x,
        y,
        rotate,
        handleDragEnd,
        handleInteraction
    };
};

