
import { MovieApi } from '@/api';

export interface SearchResultItem extends Partial<MovieApi.Movie>, Partial<MovieApi.MovieDetails> {
    media_type: 'movie' | 'tv';
}
