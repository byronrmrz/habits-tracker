import { configureStore } from "@reduxjs/toolkit";
import habitReducer from "../feature/habit/habitSlice";

export const makeStore = () => {
    return configureStore({
        reducer: { habit: habitReducer },
    });
};  // empty reducer for now, will be populated later

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

