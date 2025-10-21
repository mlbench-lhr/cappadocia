import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GeneralState {
  updateProfileStep: number;
  blogTier: "Tier 1" | "Tier 2" | "Tier 3" | null;
}

const initialState: GeneralState = {
  updateProfileStep: 0,
  blogTier: null,
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setUpdateProfileStep: (
      state,
      action: PayloadAction<NonNullable<GeneralState["updateProfileStep"]>>
    ) => {
      state.updateProfileStep = action.payload;
    },
    setBlogTier: (
      state,
      action: PayloadAction<NonNullable<GeneralState["blogTier"]>>
    ) => {
      state.blogTier = action.payload;
    },
    updateProfileStepNext: (state) => {
      state.updateProfileStep = state.updateProfileStep + 1;
    },
    updateProfileStepBack: (state) => {
      state.updateProfileStep = state.updateProfileStep - 1;
    },
  },
});

export const {
  setUpdateProfileStep,
  updateProfileStepNext,
  updateProfileStepBack,
  setBlogTier,
} = generalSlice.actions;
export default generalSlice.reducer;
