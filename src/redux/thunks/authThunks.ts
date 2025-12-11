import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/entities/auth/api/authApi';

export const loginThunk = createAsyncThunk(
    'auth/login',
    async (_, thunkAPI) => {
        try {
            const res = await authApi.getCurrentUser();

            // user exists
            return res.data;
        } catch {
            await authApi.login();
            const res = await authApi.getCurrentUser();
            return res.data;
        }
    }
); 