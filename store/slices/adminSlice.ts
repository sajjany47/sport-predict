import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  mobile: string;
  credits: number;
  subscriptionPlan: string;
  subscriptionExpiry: string;
  status: "active" | "suspended" | "banned";
  joinedDate: string;
  lastLogin: string;
}

interface AdminOrder {
  id: string;
  userId: string;
  userName: string;
  plan: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed" | "refunded";
  paymentMethod: string;
}

interface AdminTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

interface FinanceStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  pendingPayments: number;
  refunds: number;
  averageOrderValue: number;
}

interface AdminState {
  users: AdminUser[];
  orders: AdminOrder[];
  tickets: AdminTicket[];
  financeStats: FinanceStats;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  orders: [],
  tickets: [],
  financeStats: {
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    pendingPayments: 0,
    refunds: 0,
    averageOrderValue: 0,
  },
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<AdminUser[]>) => {
      state.users = action.payload;
    },
    setOrders: (state, action: PayloadAction<AdminOrder[]>) => {
      state.orders = action.payload;
    },
    setTickets: (state, action: PayloadAction<AdminTicket[]>) => {
      state.tickets = action.payload;
    },
    setFinanceStats: (state, action: PayloadAction<FinanceStats>) => {
      state.financeStats = action.payload;
    },
    updateUserStatus: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) {
        user.status = action.payload.status as any;
      }
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status as any;
      }
    },
    updateTicketStatus: (
      state,
      action: PayloadAction<{ id: string; status: string; assignedTo?: string }>
    ) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket.status = action.payload.status as any;
        ticket.updatedAt = new Date().toISOString();
        if (action.payload.assignedTo) {
          ticket.assignedTo = action.payload.assignedTo;
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  setOrders,
  setTickets,
  setFinanceStats,
  updateUserStatus,
  updateOrderStatus,
  updateTicketStatus,
  setLoading,
  setError,
} = adminSlice.actions;

export default adminSlice.reducer;
