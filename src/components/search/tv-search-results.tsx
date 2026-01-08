
import type { RecommendationApi } from '@/api';
import { MediaCard } from '../media-card';
import { useSearchTV } from '@/hooks';
import { SearchLoadingSpinner } from './search-loading-spinner';
import { NoSearchResults } from './no-search-results';

interface Props {
    query: string;
}

export function TVSearchResults({ query }: Props) {
    const { results, loading } = useSearchTV(query);

    if (loading) return <SearchLoadingSpinner />;
    if (!results.length) return <NoSearchResults query={query} />;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {results.map((item) => {
                const cardItem: RecommendationApi.RecommendationResult = {
                    tmdbId: item.id,
                    title: item.name,
                    overview: item.overview,
                    poster_path: item.poster_path,
                    mediaType: 'TV'
                };
                return <MediaCard key={item.id} item={cardItem} showScore={false} />;
            })}
        </div>
    );
};
