import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader, ChevronLeft } from 'lucide-react';
import { MovieApi, TvApi } from '@/api';
import type { TitleDetail } from '../content-details/models';

export function ExploreDetails() {
    const { type, id } = useParams<{ type: string; id: string }>();
    const mediaType = type === 'movie' ? 'MOVIE' : 'TV';
    const tmdbId = Number(id);

    const [details, setDetails] = useState<TitleDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                let data;
                if (mediaType === 'MOVIE') {
                    const movieData = await MovieApi.getDetails(tmdbId);
                    data = movieData;
                } else {
                    const tvData = await TvApi.getDetails(tmdbId);
                    data = {
                        ...tvData,
                        title: tvData.name,
                        release_date: tvData.first_air_date
                    };
                }
                setDetails(data);
            } catch (error) {
                console.error("Failed to load details", error);
            } finally {
                setLoading(false);
            }
        };

        if (tmdbId) {
            fetchAll();
        }
    }, [tmdbId, mediaType]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <Loader className="animate-spin w-10 h-10" />
            </div>
        );
    }

    if (!details) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <p>Content not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white relative">
            <div className="absolute top-0 left-0 w-full h-[50vh] z-0">
                <img
                    src={details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : ''}
                    alt="Backdrop"
                    className="w-full h-full object-cover opacity-40 mask-image-gradient"
                />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
                <button onClick={() => window.history.back()} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft size={20} /> Back
                </button>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0 w-48 md:w-64 rounded-xl overflow-hidden shadow-2xl mx-auto md:mx-0">
                        <img
                            src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : 'https://via.placeholder.com/300x450'}
                            alt={details.title}
                            className="w-full h-auto"
                        />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2">{details.title}</h1>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-400 mb-4">
                            <span>{details.release_date || details.first_air_date ? new Date(details.release_date || details.first_air_date!).getFullYear() : 'N/A'}</span>
                            <span>•</span>
                            <span className="text-yellow-500 font-bold">{details.vote_average.toFixed(1)}/10</span>
                            <span>•</span>
                            {details.genres.map(g => g.name).join(', ')}
                        </div>

                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                            {details.overview}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

