import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from "./slices/EmployeeSlice"

const store = configureStore({
  reducer: {
    employee: employeeReducer,
  },
});

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Optionally, define `AppDispatch` type if needed
export type AppDispatch = typeof store.dispatch;

export default store;
