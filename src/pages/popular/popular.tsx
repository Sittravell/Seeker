
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { MovieApi, RecommendationApi, TvApi } from '@/api';
import type { RootState } from '../../store/store';
import { Loader } from 'lucide-react';
import { MediaCard } from '@/components';

export function Popular() {
    const [trending, setTrending] = useState<RecommendationApi.RecommendationResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Get user recommendations from Redux to check for overlap
    const { personal } = useSelector((state: RootState) => state.recommendations);

    // Create a Set of Recommended IDs (Format: "MOVIE:123" or "TV:456")
    const recommendedSet = new Set(personal.map(item => `${item.mediaType}:${item.tmdbId}`));

    // Infinite Scroll Ref
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch both movies and tv for current page
                const [moviesData, tvData] = await Promise.all([
                    MovieApi.getPopular(page),
                    TvApi.getPopular(page)
                ]);

                // Check if we reached the end (arbitrary check, usually total_pages)
                if (page >= moviesData.total_pages || page >= tvData.total_pages) {
                    setHasMore(false);
                }

                // Transform to unified structure
                const movies = moviesData.results.map(m => ({
                    tmdbId: m.id,
                    title: m.title,
                    overview: m.overview,
                    poster_path: m.poster_path,
                    score: m.popularity,
                    mediaType: 'MOVIE' as const
                }));

                const tv = tvData.results.map(t => ({
                    tmdbId: t.id,
                    title: t.name,
                    overview: t.overview,
                    poster_path: t.poster_path,
                    score: t.popularity,
                    mediaType: 'TV' as const
                }));

                // Combine and Randomize new batch
                const combined = [...movies, ...tv];
                for (let i = combined.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [combined[i], combined[j]] = [combined[j], combined[i]];
                }

                // Append unique items
                setTrending(prev => {
                    const existingIds = new Set(prev.map(i => `${i.mediaType}:${i.tmdbId}`));
                    const uniqueNew = combined.filter(i => !existingIds.has(`${i.mediaType}:${i.tmdbId}`));
                    return [...prev, ...uniqueNew];
                });

            } catch (error) {
                console.error("Failed to fetch popular content", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page]);

    return (
        <div className="min-h-screen bg-gray-900 text-white px-4 pb-4 pt-0 md:p-8 lg:p-8">
            <h1 className="text-3xl font-bold mb-8 text-purple-400">Popular Now</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {trending.map((item, index) => {
                    const isRecommended = recommendedSet.has(`${item.mediaType}:${item.tmdbId}`);
                    const isLastElement = index === trending.length - 1;

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
            {loading && (
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
