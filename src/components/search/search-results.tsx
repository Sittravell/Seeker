import { MovieSearchResults } from "./movie-search-results";
import { MultiSearchResults } from "./multi-search-results";
import { TVSearchResults } from "./tv-search-results";

interface Props {
    query: string;
    context: 'movie' | 'tv' | 'multi';
}

export function SearchResults({ query, context }: Props) {
    if (context === 'movie') return <MovieSearchResults query={query} />;
    if (context === 'tv') return <TVSearchResults query={query} />;
    return <MultiSearchResults query={query} />;
};

