import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { taskApi } from './taskApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
