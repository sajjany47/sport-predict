import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
}

interface OrderHistory {
  id: string;
  plan: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface SubscriptionState {
  plans: SubscriptionPlan | null;
  orderHistory: OrderHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  plans: null,
  orderHistory: [],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<SubscriptionPlan>) => {
      state.plans = action.payload;
    },
    setOrderHistory: (state, action: PayloadAction<OrderHistory[]>) => {
      state.orderHistory = action.payload;
    },
    addOrder: (state, action: PayloadAction<OrderHistory>) => {
      state.orderHistory.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setPlans, setOrderHistory, addOrder, setLoading, setError } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
