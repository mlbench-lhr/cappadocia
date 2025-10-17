import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OverviewType {
  milestoneOverview: {
    completed: string;
    inProgress: string;
    overdue: number;
  };
  overview: { milestones: number; month: string; users: number }[];
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
    milestones: {
      total: number;
      percent: number;
      increased: boolean;
    };
  };
}

interface MilestoneData {
  date: string;
  value: number;
}

interface AdminState {
  overview: OverviewType;
  milestonesCompletion: MilestoneData[];
}
const initialState: AdminState = {
  overview: {
    milestoneOverview: {
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
      milestones: {
        total: 0,
        percent: 0,
        increased: false,
      },
    },
  },
  milestonesCompletion: [{ date: "", value: 0 }],
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
    setMilestonesCompletion: (
      state,
      action: PayloadAction<NonNullable<AdminState["milestonesCompletion"]>>
    ) => {
      state.milestonesCompletion = action.payload;
    },
  },
});

export const { setOverview, setMilestonesCompletion } = adminSlice.actions;
export default adminSlice.reducer;
