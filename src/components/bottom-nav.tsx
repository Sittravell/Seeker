
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Film, Tv, Star, User } from 'lucide-react';

export function BottomNav() {
    const navItems = [
        { name: 'Explore', path: '/explore', icon: Compass },
        { name: 'Movies', path: '/movies', icon: Film },
        { name: 'Series', path: '/series', icon: Tv },
        { name: 'Matches', path: '/recommendations', icon: Star },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
            <div className="border-t border-gray-800 bg-gray-900/95 backdrop-blur-md pb-safe">
                <div className="flex h-16 items-center justify-around px-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200
                                ${isActive ? 'text-purple-500' : 'text-gray-400 hover:text-gray-200'}
                            `}
                        >
                            <item.icon className="h-6 w-6" />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};
