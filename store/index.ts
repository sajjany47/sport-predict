import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import matchSlice from "./slices/matchSlice";
import subscriptionSlice from "./slices/subscriptionSlice";
import helpdeskSlice from "./slices/helpdeskSlice";
import adminSlice from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    matches: matchSlice,
    subscription: subscriptionSlice,
    helpdesk: helpdeskSlice,
    admin: adminSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
