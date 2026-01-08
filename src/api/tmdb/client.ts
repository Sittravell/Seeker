import axios from 'axios';

export const tmdb = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

tmdb.interceptors.request.use(
    (config) => {
        const token = import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

tmdb.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);
