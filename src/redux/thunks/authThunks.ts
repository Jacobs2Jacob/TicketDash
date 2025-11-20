import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/services/api/authApi';

export const loginThunk = createAsyncThunk(
    'auth/login',
    async (_, thunkAPI) => {
        try {
            // Backend sets HttpOnly cookie
            const res = await authApi.login();
            return res.data;
        } catch (error: any) {
            // Let interceptor + middleware handle global errors
            return thunkAPI.rejectWithValue(error);
        }
    }
);