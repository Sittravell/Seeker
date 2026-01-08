import { useNavigate } from 'react-router-dom';
import { Heart, X, Minus, Bookmark, ArrowRight, Loader } from 'lucide-react';
import UseInteractionHandler from './use-interaction-handler';
import { motion } from 'framer-motion';
import { useRecommendationQueue } from './use-recommendation-queue';
import { ExploreCard } from './explore-card';

export function Explore() {
    const navigate = useNavigate();

    const {
        currentTitle,
        isLoading
    } = useRecommendationQueue();

    const {
        x,
        y,
        rotate,
        handleDragEnd,
        handleInteraction
    } = UseInteractionHandler({ currentTitle });

    if (!currentTitle && isLoading) {
        return (
            <div className="flex items-center justify-center inset-0 bg-gray-900 text-white">
                <Loader className="animate-spin w-10 h-10" />
            </div>
        );
    }

    if (!currentTitle && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center inset-0 bg-gray-900 text-white p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">No more recommendations!</h2>
                <p className="text-gray-400 mb-6">We've run out of movies for you. Try again later.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-purple-600 rounded-lg font-semibold hover:bg-purple-500 transition"
                >
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="inset-0 bg-gray-900 text-white flex flex-col items-center py-8 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl px-4 justify-center relative">

                <div className="hidden md:flex flex-col gap-4 order-2 md:order-1">
                    <button
                        onClick={() => handleInteraction('DISLIKE')}
                        className="w-16 h-16 rounded-full bg-gray-800 border-2 border-red-500/50 text-red-500 flex items-center justify-center hover:bg-red-500/10 hover:scale-110 transition-all shadow-lg"
                        title="Dislike"
                    >
                        <X size={32} />
                    </button>
                    <button
                        onClick={() => handleInteraction('NOT_WANT')}
                        className="w-16 h-16 rounded-full bg-gray-800 border-2 border-yellow-500/50 text-yellow-500 flex items-center justify-center hover:bg-yellow-500/10 hover:scale-110 transition-all shadow-lg"
                        title="Not Interested"
                    >
                        <Minus size={32} />
                    </button>
                </div>

                <div className="order-1 md:order-2 z-10 relative">
                    <motion.div
                        style={{ x, y, rotate }}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.7}
                        onDragEnd={handleDragEnd}
                        className="touch-none cursor-grab active:cursor-grabbing relative"
                        whileTap={{ scale: 1.05 }}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleInteraction('SKIPPED');
                            }}
                            className="absolute top-1 right-1 z-50 w-10 h-10 rounded-full bg-gray-800  text-white flex md:hidden items-center justify-center shadow-xl border border-white/20 hover:bg-gray-500"
                        >
                            <X size={20} />
                        </button>

                        <ExploreCard
                            movie={currentTitle}
                            onTitleClick={() => navigate(`/explore/details/${currentTitle.mediaType === 'MOVIE' ? 'movie' : 'tv'}/${currentTitle.tmdbId}`)}
                        />
                    </motion.div>
                </div>

                <div className="hidden md:flex flex-col gap-4 order-3">
                    <button
                        onClick={() => handleInteraction('LIKE')}
                        className="w-16 h-16 rounded-full bg-gray-800 border-2 border-green-500/50 text-green-500 flex items-center justify-center hover:bg-green-500/10 hover:scale-110 transition-all shadow-lg"
                        title="Like"
                    >
                        <Heart size={32} />
                    </button>
                    <button
                        onClick={() => handleInteraction('WANT')}
                        className="w-16 h-16 rounded-full bg-gray-800 border-2 border-blue-500/50 text-blue-500 flex items-center justify-center hover:bg-blue-500/10 hover:scale-110 transition-all shadow-lg"
                        title="Want to Watch"
                    >
                        <Bookmark size={32} />
                    </button>
                </div>
            </div>

            <div className="mt-8 order-4 hidden md:block">
                <button
                    onClick={() => handleInteraction('SKIPPED')}
                    className="px-8 py-3 rounded-full bg-gray-800 text-gray-400 font-semibold flex items-center gap-2 hover:bg-gray-700 hover:text-white transition-all shadow-lg"
                >
                    Skip <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

