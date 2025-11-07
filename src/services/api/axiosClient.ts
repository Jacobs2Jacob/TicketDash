import axios from 'axios';
 
// Create the Axios instance
export const axiosClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor - attach JWT
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle HTTP errors
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401) {
            // expired or invalid token - redirect
            window.location.href = '/login';
        }

        if (status === 409) {
            // conflict - maybe dispatch stale flag (future)
            console.warn('Conflict detected, may need refetch.');
        }

        return Promise.reject(error);
    }
);