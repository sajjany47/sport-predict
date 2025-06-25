import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SubscriptionPlan {
  id: string;
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
  status: 'completed' | 'pending' | 'failed';
}

interface SubscriptionState {
  plans: SubscriptionPlan[];
  orderHistory: OrderHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  plans: [
    {
      id: '1',
      name: 'Free',
      price: 0,
      credits: 2,
      features: ['2 Daily Credits', 'Basic Predictions', 'Limited Player Stats'],
    },
    {
      id: '2',
      name: 'Pro',
      price: 299,
      credits: 50,
      features: ['50 Monthly Credits', 'Advanced AI Predictions', 'Detailed Player Analytics', 'Priority Support'],
      popular: true,
    },
    {
      id: '3',
      name: 'Elite',
      price: 599,
      credits: 150,
      features: ['150 Monthly Credits', 'Premium AI Insights', 'Complete Player Database', 'VIP Support', 'Early Access'],
    },
  ],
  orderHistory: [],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<SubscriptionPlan[]>) => {
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

export const { setPlans, setOrderHistory, addOrder, setLoading, setError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;