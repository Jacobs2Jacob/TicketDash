import { createSlice } from '@reduxjs/toolkit'; 
import { loginThunk } from '../thunks/authThunks';

interface AuthState {
    isLoggedIn: boolean;
    loading: boolean;
}

const initialState: AuthState = {
    isLoggedIn: false,
    loading: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isLoggedIn = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginThunk.fulfilled, (state) => {
                state.loading = false;
                state.isLoggedIn = true;
            })
            .addCase(loginThunk.rejected, (state) => {
                state.loading = false;
            });
    }
});

export const {
    logout
} = authSlice.actions;

export default authSlice.reducer;