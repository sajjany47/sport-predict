import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  _id: string;
  userId: string;
  type: "payment" | "support" | "credit" | "system";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  loading: boolean;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  loading: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (
      state,
      action: PayloadAction<{ data: Notification[]; unreadCount: number }>
    ) => {
      state.items = action.payload.data;
      state.unreadCount = action.payload.unreadCount;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.items.find((n) => n._id === action.payload);
      if (notif && !notif.isRead) {
        notif.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
  },
});

export const {
  setNotifications,
  setLoading,
  markAsRead,
  markAllAsRead,
  addNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
