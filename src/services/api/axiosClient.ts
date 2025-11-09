import axios from 'axios';

// Create a single Axios instance for all API calls
export const axiosClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor – attach JWT automatically
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            // Attach Bearer token if present
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor – centralized HTTP error handling
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401) {
            // Token expired / invalid
            console.warn('Unauthorized – redirecting to login...');
            localStorage.removeItem('accessToken'); // clear bad token
            //window.location.href = '/login';
        }

        if (status === 409) {
            // concurrent update or conflict
            console.warn('Conflict detected – consider re-fetching data.');
        }

        if (!error.response) {
            console.error('Network error or server unreachable');
        }

        return Promise.reject(error);
    }
);