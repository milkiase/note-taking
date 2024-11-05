import { RootState } from "../store";

export const selectTodos = (state: RootState) => state.noteTaking.todos;
export const selectInProgress = (state: RootState) => state.noteTaking.inProgress;
export const selectDone = (state: RootState) => state.noteTaking.done;