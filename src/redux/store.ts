import { configureStore } from '@reduxjs/toolkit'; 
import { signalrMiddleware } from '@/redux/middlewares/signalrMiddleware';
import { httpErrorMiddleware } from '@/redux/middlewares/httpErrorMiddleware';
import authReducer from '@/redux/slices/authSlice';
import httpErrorSlice from '@/redux/slices/httpErrorSlice';

export const store = configureStore({
    reducer: { 
        auth: authReducer,
        httpError: httpErrorSlice,
    },
    middleware: (getDefault) =>
        getDefault({
            serializableCheck: false,
        }).concat(signalrMiddleware, httpErrorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;