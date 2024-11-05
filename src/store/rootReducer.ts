import { combineReducers } from '@reduxjs/toolkit';
import { noteTakingReducer } from './noteTaking/noteTaking.slice';

export const rootReducer = combineReducers({
    noteTaking: noteTakingReducer,
})