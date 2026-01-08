import React from 'react';
import { Film } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4">
            {/* Abstract Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-violet-500/10 blur-[100px] rounded-full" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-500 mb-4 shadow-lg shadow-violet-500/20">
                        <Film className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                    <p className="text-gray-400">{subtitle}</p>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
};
