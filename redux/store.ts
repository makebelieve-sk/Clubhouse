import {configureStore, combineReducers, Store} from '@reduxjs/toolkit'
import {roomsReducer} from './slices/roomSlice';
import {createWrapper} from "next-redux-wrapper";
import {userReducer, userSlice} from "./slices/userSlice";
import {RootState} from "./types";

// Инициализация редьюсера
export const rootReducer = combineReducers({
    rooms: roomsReducer,
    user: userReducer,
});

// Инициазилируем стор
export const makeStore = (): Store<RootState> => {
    const store: Store = configureStore({
        reducer: rootReducer
    });

    return store;
}

export const wrapper = createWrapper(makeStore, {debug: true});