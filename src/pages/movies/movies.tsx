
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Loader } from 'lucide-react';
import { UseInfiniteScrollObserver } from '@/hooks';
import usePopularMovies from './use-popular-movies';
import { MediaCard } from '@/components';

export function Movies() {
    const [page, setPage] = useState(1);
    const { personal } = useSelector((state: RootState) => state.recommendations);
    const recommendedSet = new Set(personal.map(item => `${item.mediaType}:${item.tmdbId}`));

    const {
        movies,
        isLoading,
        hasMore,
    } = usePopularMovies({
        page
    })

    const {
        lastElementRef
    } = UseInfiniteScrollObserver({
        isLoading: isLoading,
        hasMore: hasMore,
        onLoadMore: () => setPage(prevPage => prevPage + 1)
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white px-4 pb-4 pt-0 md:p-8 lg:p-8">
            <h1 className="text-3xl font-bold mb-8 text-purple-400">Popular Movies</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map((item, index) => {
                    const isRecommended = recommendedSet.has(`${item.mediaType}:${item.tmdbId}`);
                    const isLastElement = index === movies.length - 1;

                    return (
                        <div key={`${item.mediaType}-${item.tmdbId}`} ref={isLastElement ? lastElementRef : null}>
                            <MediaCard
                                item={item}
                                isRecommended={isRecommended}
                            />
                        </div>
                    );
                })}
            </div>
            {isLoading && (
                <div className="flex items-center justify-center p-8 w-full">
                    <Loader className="animate-spin w-8 h-8 text-purple-400" />
                </div>
            )}
            {!hasMore && (
                <div className="text-center p-8 text-gray-500">
                    No more results.
                </div>
            )}
        </div>
    );
};
