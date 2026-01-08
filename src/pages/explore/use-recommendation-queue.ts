import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ExploreStore, Store } from '@/store';

export function useRecommendationQueue() {
    const dispatch = useDispatch<Store.AppDispatch>();
    const { queue, loading } = useSelector((state: Store.RootState) => state.explore);

    useEffect(() => {
        if (queue.length < 3 && !loading) {
            dispatch(ExploreStore.fetchExploreResults());
        }
    }, [queue.length, loading, dispatch]);

    const currentTitle = queue[0];

    return {
        isLoading: loading,
        currentTitle,
        queue,
    }
};

