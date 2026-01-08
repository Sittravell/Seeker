
import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RecommendationApi } from '@/api';

interface MediaCardProps {
    item: RecommendationApi.RecommendationResult;
    isRecommended?: boolean;
    showScore?: boolean;
}

export function MediaCard({ item, isRecommended, showScore }: MediaCardProps) {
    const linkPath = item.mediaType === 'MOVIE' ? `/movies/${item.tmdbId}` : `/series/${item.tmdbId}`;

    return (
        <Link to={linkPath} className="block">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg relative group hover:scale-105 transition-transform duration-300 h-full">
                {/* Recommended Badge */}
                {isRecommended && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center gap-1 shadow-md">
                        <Star size={12} fill="black" /> Recommended
                    </div>
                )}

                {/* Match Score Badge */}
                {showScore && item.score && (
                    <div className="absolute top-2 right-2 bg-black/60 text-yellow-500 text-xs font-bold px-2 py-1 rounded-full z-10 backdrop-blur-md border border-yellow-500/30">
                        {Math.round(item.score * 100)}% Match
                    </div>
                )}

                <div className="aspect-[2/3] relative">
                    <img
                        src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded uppercase backdrop-blur-sm">
                        {item.mediaType}
                    </div>
                </div>

                <div className="hidden md:block lg:block p-4">
                    <h3 className="font-bold text-lg truncate" title={item.title}>{item.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mt-1">{item.overview}</p>
                </div>
            </div>
        </Link>
    );
};
