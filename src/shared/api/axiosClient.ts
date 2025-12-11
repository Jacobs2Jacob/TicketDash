import axios from 'axios';
import { store } from '@/redux/store';
import { httpErrorAction } from '@/redux/slices/httpErrorSlice';

// Create a single Axios instance for all API calls
export const axiosClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: true,
});

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status ?? null;

        const message =
            error?.response?.data?.message ||
            error?.message ||
            'Unknown network error';

        // Dispatch to http error middleware
        store.dispatch(
            httpErrorAction({
                status,
                message,
            })
        );

        return Promise.reject({ status, message });
    }
);