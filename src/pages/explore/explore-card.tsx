import { MovieApi, RecommendationApi, TvApi } from '@/api';
import { useEffect, useState } from 'react';

interface ExploreCardProps {
    movie: RecommendationApi.RecommendationResult;
    onTitleClick?: () => void;
}

export function ExploreCard({ movie, onTitleClick }: ExploreCardProps) {
    const [details, setDetails] = useState<MovieApi.MovieDetails | TvApi.TVShowDetails | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (movie.mediaType === 'TV') {
                    const data = await TvApi.getDetails(movie.tmdbId);
                    setDetails(data);
                } else {
                    const data = await MovieApi.getDetails(movie.tmdbId);
                    setDetails(data);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchDetails();
    }, [movie.tmdbId]);

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';

    return (
        <div className="relative w-full max-w-sm h-[600px] bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col group">
            <img
                src={posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 pt-20">
                <h2
                    onClick={onTitleClick}
                    className="text-3xl font-bold text-white mb-2 cursor-pointer hover:text-purple-400 transition-colors"
                >
                    {movie.title}
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                    {details?.genres.slice(0, 3).map(g => (
                        <span key={g.id} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                            {g.name}
                        </span>
                    ))}
                </div>
                <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                    {movie.overview}
                </p>
            </div>
        </div>
    );
};
