import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from 'redux-persist/lib/storage'


// const persistedReducer = persistReducer({
//     key: 'note-taking',
//     storage,
//     whitelist: ['noteTaking']
// }, rootReducer)

export type RootState = ReturnType<typeof rootReducer>
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export type RootActions = typeof store.dispatch

// export const persistor = persistStore(store)