
import type { RecommendationApi } from '@/api';
import { useSearchMulti } from '@/hooks/search/use-search-multi';
import { SearchLoadingSpinner } from './search-loading-spinner';
import { NoSearchResults } from './no-search-results';
import { MediaCard } from '../media-card';

interface Props {
    query: string;
}

export function MultiSearchResults({ query }: Props) {
    const { results, loading } = useSearchMulti(query);

    if (loading) return <SearchLoadingSpinner />;
    if (!results.length) return <NoSearchResults query={query} />;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {results.map((item) => {
                const cardItem: RecommendationApi.RecommendationResult = {
                    tmdbId: item.id!,
                    title: item.title || 'Unknown',
                    overview: item.overview || null,
                    poster_path: item.poster_path || null,
                    mediaType: item.media_type === 'movie' ? 'MOVIE' : 'TV'
                };
                return <MediaCard key={`${item.media_type}-${item.id}`} item={cardItem} showScore={false} />;
            })}
        </div>
    );
};

