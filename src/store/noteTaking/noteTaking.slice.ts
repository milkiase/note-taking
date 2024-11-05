import { PayloadAction } from './../../../node_modules/@reduxjs/toolkit/src/createAction';
import { createSlice } from "@reduxjs/toolkit";

export type NoteTakingState = {
    todos: string[];
    inProgress: string[];
    done: string[];
}

const initialState: NoteTakingState = {
    todos: [],
    inProgress: [],
    done: []
}

const noteTakingSlice = createSlice({
    name: 'noteTaking',
    initialState,
    reducers: {
        setTodos(state, action:PayloadAction<string[]>) {
            state.todos = action.payload;
            console.log("state.todos", state.todos)
        },
        setInProgress(state, action:PayloadAction<string[]>) {
            state.inProgress = action.payload;
        },
        setDone(state, action:PayloadAction<string[]>) {
            state.done = action.payload;
        },
    }
})

export const { setTodos, setInProgress, setDone } = noteTakingSlice.actions

export const noteTakingReducer = noteTakingSlice.reducer