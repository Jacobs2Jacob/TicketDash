import { configureStore } from '@reduxjs/toolkit';
import ticketsReducer from '@/redux/slices/ticketSlice';
import { signalrMiddleware } from '@/redux/middlewares/signalrMiddleware';
import { httpErrorMiddleware } from '@/redux/middlewares/httpErrorMiddleware';

export const store = configureStore({
    reducer: {
        tickets: ticketsReducer,
    },
    middleware: (getDefault) =>
        getDefault({
            serializableCheck: false,
        }).concat(signalrMiddleware, httpErrorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;