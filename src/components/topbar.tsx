
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, X, User as UserIcon, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/auth/slice';
import { ProfileAvatar } from './profile-avatar';

export function Topbar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const { data: user } = useSelector((state: RootState) => state.user);
    const username = user?.username || 'User';
    const profilePicture = user?.profilePicture;

    // Local state for input to control debounce
    const [query, setQuery] = useState(searchParams.get('search') || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) {
                setSearchParams({ search: query });
            } else {
                // If query is empty, remove the param
                searchParams.delete('search');
                setSearchParams(searchParams);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, setSearchParams, searchParams]); // Warning: searchParams dependency might cause loops if not careful

    // Sync input if URL changes externally (e.g. back button)
    useEffect(() => {
        const urlQuery = searchParams.get('search') || '';
        if (urlQuery !== query) {
            setQuery(urlQuery);
        }
    }, [searchParams]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const clearSearch = () => {
        setQuery('');
        searchParams.delete('search');
        setSearchParams(searchParams);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="sticky top-0 z-20 flex flex-shrink-0 h-16 bg-gray-900/95 backdrop-blur">
            <div className="flex-1 px-4 flex justify-between items-center sm:px-6 lg:px-8">
                {/* Search Bar */}
                {/* Search Bar */}
                {['/profile', '/explore'].includes(location.pathname) ? (
                    <div className="flex flex-1"></div>
                ) : (
                    <div className="flex flex-1">
                        <div className="relative w-full text-gray-400 focus-within:text-gray-200">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <input
                                name="search"
                                id="search"
                                className="block w-full pl-10 pr-10 py-2 border border-white/10 rounded-full leading-5 bg-gray-800/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-800 focus:border-white/20 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Search Movies & TV"
                                type="search"
                                autoComplete="off"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            {query && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-white"
                                >
                                    <X className="h-5 w-5" aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Right Side - User Dropdown */}
                <div className="ml-4 flex items-center md:ml-6" ref={dropdownRef}>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all hover:ring-2 ring-gray-700"
                        >
                            <span className="sr-only">Open user menu</span>
                            <ProfileAvatar username={username || 'User'} profilePicture={profilePicture} size="sm" />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 divide-y divide-gray-700">
                                {/* User Info Header */}
                                <div className="px-4 py-3">
                                    <p className="text-sm text-gray-300">Signed in as</p>
                                    <p className="text-sm font-medium text-white truncate">{username}</p>
                                </div>

                                <div className="py-1">
                                    <Link to="/profile" className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsDropdownOpen(false)}>
                                        <UserIcon className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-300" />
                                        Profile
                                    </Link>
                                    {/* <Link to="/requests" className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsDropdownOpen(false)}>
                                        <Star className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-300" />
                                        Requests
                                    </Link>
                                    <Link to="/settings" className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsDropdownOpen(false)}>
                                        <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-300" />
                                        Settings
                                    </Link> */}
                                </div>

                                <div className="py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="group flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                    >
                                        <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-300" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
