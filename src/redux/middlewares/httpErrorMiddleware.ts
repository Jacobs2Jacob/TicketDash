import { type Middleware } from '@reduxjs/toolkit';

export const httpErrorMiddleware: Middleware = () => (next) => (action: any) => {

    // Handle global axios-dispatched errors
    if (action.type === 'http/error') {
        const { status, message } = action.payload;

        if (status === 401) {
            window.location.href = '/login';
        }

        if (status === 500) {
            console.error('Server error:', message);
        }
    }

    return next(action);
};