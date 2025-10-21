import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OverviewType {
  blogOverview: {
    completed: string;
    inProgress: string;
    overdue: number;
  };
  overview: { blogs: number; month: string; users: number }[];
  sinceLastMonth: {
    users: {
      total: number;
      percent: number;
      increased: boolean;
    };
    opportunities: {
      total: number;
      percent: number;
      increased: boolean;
    };
    blogs: {
      total: number;
      percent: number;
      increased: boolean;
    };
  };
}

interface BlogData {
  date: string;
  value: number;
}

interface AdminState {
  overview: OverviewType;
  blogsCompletion: BlogData[];
}
const initialState: AdminState = {
  overview: {
    blogOverview: {
      completed: "0",
      inProgress: "0",
      overdue: 0,
    },
    overview: [],
    sinceLastMonth: {
      users: {
        total: 0,
        percent: 0,
        increased: false,
      },
      opportunities: {
        total: 0,
        percent: 0,
        increased: false,
      },
      blogs: {
        total: 0,
        percent: 0,
        increased: false,
      },
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
