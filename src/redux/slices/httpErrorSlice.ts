import { createAction, createSlice } from '@reduxjs/toolkit';

export interface HttpErrorPayload {
    status: number | null;
    message: string;
}

export const httpErrorAction = createAction<HttpErrorPayload>('http/error');

interface HttpErrorState {
    lastError: HttpErrorPayload | null;
}

const initialState: HttpErrorState = {
    lastError: null,
};

export const httpErrorSlice = createSlice({
    name: 'http',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(httpErrorAction, (state, action) => {
            state.lastError = action.payload;
        });
    },
});

export default httpErrorSlice.reducer;