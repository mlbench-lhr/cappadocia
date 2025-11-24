import { ToursAndActivityWithVendor } from "@/lib/mongodb/models/ToursAndActivity";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GeneralState {
  signupSteps: number;
  blogTier: "Tier 1" | "Tier 2" | "Tier 3" | null;
  activitySearch: string;
  activityFilterDate: Date | undefined;
  displayExploreItems: ToursAndActivityWithVendor[] | null;
}

const initialState: GeneralState = {
  signupSteps: 0,
  blogTier: null,
  activitySearch: "",
  activityFilterDate: undefined,
  displayExploreItems: null,
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setUpdateProfileStep: (
      state,
      action: PayloadAction<NonNullable<GeneralState["signupSteps"]>>
    ) => {
      state.signupSteps = action.payload;
    },
    setBlogTier: (
      state,
      action: PayloadAction<NonNullable<GeneralState["blogTier"]>>
    ) => {
      state.blogTier = action.payload;
    },
    setDisplayExploreItems: (
      state,
      action: PayloadAction<NonNullable<GeneralState["displayExploreItems"]>>
    ) => {
      state.displayExploreItems = action.payload;
    },
    setActivitySearch: (
      state,
      action: PayloadAction<NonNullable<GeneralState["activitySearch"]>>
    ) => {
      state.activitySearch = action.payload;
    },
    setActivityFilterDate: (
      state,
      action: PayloadAction<NonNullable<GeneralState["activityFilterDate"]>>
    ) => {
      state.activityFilterDate = action.payload;
    },
    updateProfileStepNext: (state) => {
      state.signupSteps = state.signupSteps + 1;
    },
    updateProfileStepBack: (state) => {
      state.signupSteps = state.signupSteps - 1;
    },
  },
});

export const {
  setUpdateProfileStep,
  updateProfileStepNext,
  updateProfileStepBack,
  setBlogTier,
  setActivityFilterDate,
  setActivitySearch,
  setDisplayExploreItems,
} = generalSlice.actions;
export default generalSlice.reducer;
