import { MilestoneForm } from "@/lib/types/milestones";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MilestonesState {
  generatedMilestones: MilestoneForm[];
  refreshMilestoneData: number;
}

const initialState: MilestonesState = {
  generatedMilestones: [],
  refreshMilestoneData: 0,
};

const milestonesSlice = createSlice({
  name: "milestones",
  initialState,
  reducers: {
    setGeneratedMilestones: (state, action: PayloadAction<MilestoneForm[]>) => {
      state.generatedMilestones = action.payload;
    },
    setRefreshMilestoneData: (state) => {
      state.refreshMilestoneData = state.refreshMilestoneData + 1;
    },
    removeGeneratedMilestone: (state, action: PayloadAction<number>) => {
      state.generatedMilestones = state.generatedMilestones.filter(
        (_, index) => index !== action.payload
      );
    },
  },
});

export const {
  setGeneratedMilestones,
  removeGeneratedMilestone,
  setRefreshMilestoneData,
} = milestonesSlice.actions;

export default milestonesSlice.reducer;
