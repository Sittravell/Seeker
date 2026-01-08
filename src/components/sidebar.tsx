import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Compass, Film, Tv, Star } from 'lucide-react';

export function Sidebar() {
    const navItems = [
        { name: 'Explore', path: '/explore', icon: Compass },
        { name: 'Popular', path: '/popular', icon: Star },
        { name: 'Movies', path: '/movies', icon: Film },
        { name: 'Series', path: '/series', icon: Tv },
        { name: 'For You', path: '/recommendations', icon: Star },
    ];

    return (
        <div className="fixed top-0 bottom-0 left-0 z-30 hidden lg:flex lg:flex-shrink-0">
            <div className="sidebar flex w-64 flex-col bg-gray-900 border-r border-gray-800">
                <div className="flex h-0 flex-1 flex-col">
                    {/* Logo Area */}
                    <div className="flex flex-1 flex-col overflow-y-auto pt-8 pb-4">
                        <div className="flex flex-shrink-0 items-center px-4">
                            <Link to="/" className="flex items-center gap-2">
                                <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                    Seeker
                                </span>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="mt-16 flex-1 space-y-2 px-4">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        group flex items-center rounded-md px-2 py-2 text-lg font-medium leading-6 transition duration-150 ease-in-out focus:outline-none
                                        ${isActive
                                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>

                    </div>
                </div>
            </div>
        </div>
    );
};
