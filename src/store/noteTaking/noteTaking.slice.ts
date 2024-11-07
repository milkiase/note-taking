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
        updateTodo(state, action:PayloadAction<{id: string, value: Note}>) {
            state.todos = [...state.todos.map(todo => todo.id === action.payload.id ? action.payload.value : todo)];
        },
        updateInProgress(state, action:PayloadAction<{id: string, value: Note}>) {
            state.inProgress = [...state.inProgress.map(inProgress => inProgress.id === action.payload.id ? action.payload.value : inProgress)];
        },
        updateDone(state, action:PayloadAction<{id: string, value: Note}>) {
            state.done = [...state.done.map(done => done.id === action.payload.id ? action.payload.value : done)];
        },
        addTodo(state, action:PayloadAction<Note>) {
            state.todos = [...state.todos, action.payload]
        },
        addInProgress(state, action:PayloadAction<Note>) {
            state.inProgress = [...state.inProgress, action.payload]
        },
        addDone(state, action:PayloadAction<Note>) {
            state.done = [...state.done, action.payload]
        },
        removeTodo(state, action: PayloadAction<string>) {
            state.todos = state.todos.filter(todo => todo.id!== action.payload);
        },
        removeInProgress(state, action: PayloadAction<string>) {
            state.inProgress = state.inProgress.filter(inProgress => inProgress.id!== action.payload);
        },
        removeDone(state, action: PayloadAction<string>) {
            state.done = state.done.filter(done => done.id!== action.payload);
        }
    }
});

export const { setTodos, setInProgress, setDone, updateTodo, updateInProgress, updateDone,
    addTodo, addInProgress, addDone, removeTodo, removeInProgress, removeDone } = noteTakingSlice.actions;

export const noteTakingReducer = noteTakingSlice.reducer;