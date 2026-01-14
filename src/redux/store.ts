import { configureStore } from '@reduxjs/toolkit'; 
import { socketMiddleware } from '@/redux/middlewares/socketMiddleware';
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
        }).concat(socketMiddleware, httpErrorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;