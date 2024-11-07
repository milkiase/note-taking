import { Note } from '../../types';
import { PayloadAction } from './../../../node_modules/@reduxjs/toolkit/src/createAction';
import { createSlice } from "@reduxjs/toolkit";

export type AuthState = {
    uid: string | null;
    email: string | null;
    accessToken: string | null;
}

const initialState: AuthState = {
    uid: localStorage.getItem("uid") || null,
    email: localStorage.getItem("email") || null,
    accessToken: localStorage.getItem("accessToken") || null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUID(state, action:PayloadAction<string>) {
            state.uid = action.payload;
            localStorage.setItem('uid', action.payload);
        },
        setAccessToken(state, action:PayloadAction<string>) {
            state.accessToken = action.payload;
            localStorage.setItem('accessToken', action.payload);
        },
        setUserEmail(state, action:PayloadAction<string>) {
            state.email = action.payload;
            localStorage.setItem('email', action.payload);
        },
        signOut(state) {
            state.uid = null;
            localStorage.removeItem('uid');
            state.email = null;
            localStorage.removeItem('email');
            state.accessToken = null;
            localStorage.removeItem('accessToken');
        },
    }
});

export const { setUID, setAccessToken, signOut, setUserEmail } = authSlice.actions;

export const authReducer = authSlice.reducer;