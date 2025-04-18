import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./formSlice/formSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      form: formReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
