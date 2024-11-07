import { Note } from '../../types';
import { PayloadAction } from './../../../node_modules/@reduxjs/toolkit/src/createAction';
import { createSlice } from "@reduxjs/toolkit";

export type NoteTakingState = {
    todos: Note[];
    inProgress: Note[];
    done: Note[];
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
        setTodos(state, action:PayloadAction<Note[]>) {
            state.todos = action.payload;
        },
        setInProgress(state, action:PayloadAction<Note[]>) {
            state.inProgress = action.payload;
        },
        setDone(state, action:PayloadAction<Note[]>) {
            state.done = action.payload;
        },
        updateTodo(state, action:PayloadAction<{title: string, value: Note}>) {
            state.todos = [...state.todos.map(todo => todo.title === action.payload.title ? action.payload.value : todo)];
        },
        updateInProgress(state, action:PayloadAction<{title: string, value: Note}>) {
            state.inProgress = [...state.inProgress.map(inProgress => inProgress.title === action.payload.title ? action.payload.value : inProgress)];
        },
        updateDone(state, action:PayloadAction<{title: string, value: Note}>) {
            state.done = [...state.done.map(done => done.title === action.payload.title ? action.payload.value : done)];
        }
    }
});

export const { setTodos, setInProgress, setDone, updateTodo, updateInProgress, updateDone } = noteTakingSlice.actions;

export const noteTakingReducer = noteTakingSlice.reducer;