
import { BottomNav, Sidebar, Topbar, SearchResults } from '@/components';
import React from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const searchQuery = searchParams.get('search');

    // Determine search context
    let context: 'movie' | 'tv' | 'multi' = 'multi';
    if (location.pathname.startsWith('/movies')) context = 'movie';
    else if (location.pathname.startsWith('/series')) context = 'tv';

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <Sidebar />
            <BottomNav />
            <div className="flex-1 flex flex-col min-w-0 bg-gray-900 lg:pl-64 transition-all duration-300">
                <Topbar />
                <main className="flex-1 pb-20 lg:pb-8 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
                    {searchQuery ? (
                        <div className="animate-in fade-in duration-200">
                            <h2 className="text-xl font-semibold mb-6 text-gray-200">
                                Search Results for "{searchQuery}" <span className="text-sm font-normal text-gray-500 ml-2">({context === 'multi' ? 'All' : context === 'movie' ? 'Movies' : 'TV'})</span>
                            </h2>
                            <SearchResults query={searchQuery} context={context} />
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>
        </div>
    );
};
