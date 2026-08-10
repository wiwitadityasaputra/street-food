import { persistReducer } from "redux-persist";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { appReducer } from "@/src/lib/util/redux-provider/app-slice";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const appPersistConfig = {
  key: "total-cart",
  storage: storage,
  whitelist: ["totalCart"],
};

const persistedReducer = persistReducer(appPersistConfig, appReducer);

const rootReducer = combineReducers({
  app: persistedReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;