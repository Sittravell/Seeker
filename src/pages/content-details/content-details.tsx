
import { useParams, useLocation } from 'react-router-dom';
import { Loader, ThumbsUp, ThumbsDown, Bookmark, XCircle, ChevronLeft } from 'lucide-react';
import UseInteractions from './use-interactions';
import UseContentDetails from './use-content-details';

export function ContentDetails() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const mediaType = location.pathname.startsWith('/movies') ? 'MOVIE' : 'TV';
    const tmdbId = Number(id);

    const {
        interaction,
        isListLoading: isInteractionLoading,
        saveInteraction
    } = UseInteractions({ tmdbId, mediaType });


    const {
        details,
        isLoading: isContentLoading,
    } = UseContentDetails({ tmdbId, mediaType })

    if (isContentLoading || isInteractionLoading) {
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
            {/* Backdrop */}
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
                    {/* Poster */}
                    <div className="flex-shrink-0 w-48 md:w-64 rounded-xl overflow-hidden shadow-2xl mx-auto md:mx-0">
                        <img
                            src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : 'https://via.placeholder.com/300x450'}
                            alt={details.title}
                            className="w-full h-auto"
                        />
                    </div>

                    {/* Info */}
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

                        {/* Actions */}
                        <div className="bg-gray-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center gap-4">
                            <span className="text-sm text-gray-400 font-bold uppercase tracking-wider md:mr-4">Your Status:</span>

                            <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => saveInteraction('LIKE')}
                                    className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors w-full md:w-auto ${interaction === 'LIKE' ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    <ThumbsUp size={20} /> Like
                                </button>
                                <button
                                    onClick={() => saveInteraction('DISLIKE')}
                                    className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors w-full md:w-auto ${interaction === 'DISLIKE' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    <ThumbsDown size={20} /> Dislike
                                </button>
                                <button
                                    onClick={() => saveInteraction('WANT')}
                                    className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors w-full md:w-auto ${interaction === 'WANT' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    <Bookmark size={20} /> Watchlist
                                </button>
                                <button
                                    onClick={() => saveInteraction('NOT_WANT')}
                                    className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors w-full md:w-auto ${interaction === 'NOT_WANT' ? 'bg-orange-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    <XCircle size={20} /> Pass
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};