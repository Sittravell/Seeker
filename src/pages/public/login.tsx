import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, AlertCircle, User } from 'lucide-react';
import { AuthLayout } from '@/layouts';
import { Button, Input } from '@/components';
import { AuthStore, Store } from '@/store';

export function Login() {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const dispatch = useDispatch<Store.AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state: Store.RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        return () => {
            dispatch(AuthStore.clearError());
        };
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(AuthStore.loginUser(formData));
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <Input
                    label="Email or Username"
                    type="text"
                    placeholder="Enter your email or username"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    icon={<User className="w-5 h-5" />}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    icon={<Lock className="w-5 h-5" />}
                    required
                />

                <Button type="submit" isLoading={loading}>
                    Sign In
                </Button>

                <div className="text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                        Sign up
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};
