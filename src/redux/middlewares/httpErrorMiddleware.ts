import { type Middleware } from '@reduxjs/toolkit';

export const httpErrorMiddleware: Middleware = () => (next) => (action: any) => {
    if (action.type.endsWith('/rejected') && action.error) {
        const status = (action.error as any).status;
        if (status === 401) {
            window.location.href = '/login';
        }
    }
    return next(action);
};