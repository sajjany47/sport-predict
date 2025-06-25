import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import matchSlice from './slices/matchSlice';
import subscriptionSlice from './slices/subscriptionSlice';
import helpdeskSlice from './slices/helpdeskSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    matches: matchSlice,
    subscription: subscriptionSlice,
    helpdesk: helpdeskSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;