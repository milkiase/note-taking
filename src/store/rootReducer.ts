import { combineReducers } from '@reduxjs/toolkit';
import { noteTakingReducer } from './noteTaking/noteTaking.slice';
import { authReducer } from './auth/auth.slice';

export const rootReducer = combineReducers({
    noteTaking: noteTakingReducer,
    auth: authReducer,
})