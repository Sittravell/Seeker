
import { useRef, useCallback } from 'react';

interface Props {
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
}

export const UseInfiniteScrollObserver = ({
    isLoading,
    hasMore,
    onLoadMore
}: Props) => {
    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                onLoadMore();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, onLoadMore]);

    return { lastElementRef }
};
