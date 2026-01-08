import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    isLoading?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    isLoading,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'w-full rounded-lg px-4 py-3 font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20',
        secondary: 'bg-gray-800 hover:bg-gray-700 text-white',
        outline: 'border-2 border-gray-700 hover:border-violet-500 text-gray-300 hover:text-white bg-transparent',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : children}
        </button>
    );
};
