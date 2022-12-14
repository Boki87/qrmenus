import { configureStore, getDefaultMiddleware, Store } from "@reduxjs/toolkit";
import userReducer from "../features/user/user-slice";
import modalsReducer from "../features/modals/modal-slice";
import foodReducer from "../features/food/food-slice";

const thunkArguments = {} as { store: Store };

const customizedMiddleware = getDefaultMiddleware({
  thunk: {
    extraArgument: thunkArguments,
  },
});

export const store = configureStore({
  reducer: {
    user: userReducer,
    modals: modalsReducer,
    food: foodReducer,
  },
  middleware: customizedMiddleware,
});

thunkArguments.store = store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
