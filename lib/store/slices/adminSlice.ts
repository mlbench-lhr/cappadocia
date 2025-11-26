import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VisitSummaryItem {
  total: number; // Total visits in current month
  percentageChange: number; // Absolute % change from last month
  incremented: boolean; // True if increased, false if decreased
}

export interface VisitSummaryResponse {
  app: VisitSummaryItem; // App visits summary
  blog: VisitSummaryItem; // Blog page visits summary
  blogs: VisitSummaryItem; // All blogs combined summary (or per blog if extended)
  bookings: VisitSummaryItem; // All blogs combined summary (or per blog if extended)
  users: VisitSummaryItem; // All blogs combined summary (or per blog if extended)
  vendors: VisitSummaryItem; // All blogs combined summary (or per blog if extended)
}

interface BlogData {
  date: string;
  value: number;
}

interface AdminState {
  overview: VisitSummaryResponse;
  blogsCompletion: BlogData[];
}
const initialState: AdminState = {
  overview: {
    app: {
      total: 0,
      percentageChange: 0,
      incremented: false,
    },
    blog: {
      total: 0,
      percentageChange: 0,
      incremented: false,
    },
    blogs: {
      total: 0,
      percentageChange: 0,
      incremented: false,
    },
    bookings: {
      total: 0,
      percentageChange: 0,
      incremented: false,
    },
    users: {
      total: 0,
      percentageChange: 0,
      incremented: false,
    },
    vendors: {
      total: 0,
      percentageChange: 0,
      incremented: false,
    },
  },
  blogsCompletion: [{ date: "", value: 0 }],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setOverview: (
      state,
      action: PayloadAction<NonNullable<AdminState["overview"]>>
    ) => {
      state.overview = action.payload;
    },
    setBlogsCompletion: (
      state,
      action: PayloadAction<NonNullable<AdminState["blogsCompletion"]>>
    ) => {
      state.blogsCompletion = action.payload;
    },
  },
});

export const { setOverview, setBlogsCompletion } = adminSlice.actions;
export default adminSlice.reducer;
