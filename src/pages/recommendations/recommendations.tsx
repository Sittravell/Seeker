
import { useSelector } from 'react-redux';
import { Loader, Star, AlertCircle } from 'lucide-react';
import { MediaCard } from '@/components';
import type { Store } from '@/store';

export function Recommendations() {
    // Get user recommendations from Redux 
    const { personal, loading, error } = useSelector((state: Store.RootState) => state.recommendations);

    if (loading && personal.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <Loader className="animate-spin w-10 h-10" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-center text-red-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    <p>Failed to load recommendations.</p>
                </div>
            </div>
        );
    }

    if (personal.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
                <div className="bg-gray-800 p-8 rounded-xl max-w-lg text-center shadow-lg mb-16">
                    <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Recommendations Yet</h2>
                    <p className="text-gray-400 mb-6">
                        We need to learn about your taste! Go to the Explore page and interact with some movies or TV shows, then trigger a sync.
                    </p>
                    <a href="/explore" className="inline-block px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 font-semibold">Start Exploring</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white px-4 pb-4 pt-0 md:p-8 lg:p-8">
            <h1 className="text-3xl font-bold mb-8 text-yellow-500 flex items-center gap-3">
                <Star className="fill-current" />
                Matches
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {personal.map((item) => (
                    <MediaCard
                        key={`${item.mediaType}-${item.tmdbId}`}
                        item={item}
                        showScore={true}
                    />
                ))}
            </div>
        </div>
    );
};


