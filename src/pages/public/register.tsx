import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, User } from 'lucide-react';
import { AuthApi } from '@/api';
import { AuthLayout } from '@/layouts';
import { Button, Input } from '@/components';

export function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await AuthApi.register({ username: formData.username, email: formData.email, password: formData.password });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create account"
            subtitle="Start your journey with us today"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <Input
                    label="Username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    icon={<User className="w-5 h-5" />}
                    required
                />

                <Input
                    label="Email address"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    icon={<Mail className="w-5 h-5" />}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    icon={<Lock className="w-5 h-5" />}
                    required
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    icon={<Lock className="w-5 h-5" />}
                    required
                />

                <Button type="submit" isLoading={loading}>
                    Create Account
                </Button>

                <div className="text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                        Sign in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

