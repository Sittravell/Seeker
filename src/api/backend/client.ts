import axios from "axios";

export const backend = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
backend.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Backend Request Interceptor - Token:', token ? token.substring(0, 20) + '...' : 'null');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
backend.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
