import { RootState } from "../store";

export const selectUID = (state: RootState) => state.auth.uid;
export const selectEmail = (state: RootState) => state.auth.email;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;