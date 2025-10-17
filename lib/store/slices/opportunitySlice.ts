import { OpportunitiesCardType } from "@/lib/types/opportunities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- State ---
interface OpportunitiesState {
  opportunities: OpportunitiesCardType[]; // store multiple
  selectedOpportunity: OpportunitiesCardType | null; // single one
  queryValue: Boolean;
}

const initialState: OpportunitiesState = {
  opportunities: [],
  selectedOpportunity: null,
  queryValue: false,
};

// --- Slice ---
const opportunitiesSlice = createSlice({
  name: "opportunities",
  initialState,
  reducers: {
    // store a single opportunity
    setOpportunity: (state, action: PayloadAction<OpportunitiesCardType>) => {
      state.selectedOpportunity = action.payload;
    },
    setQueryValue: (state, action: PayloadAction<Boolean>) => {
      state.queryValue = action.payload;
    },
    // store multiple opportunities
    setOpportunities: (
      state,
      action: PayloadAction<OpportunitiesCardType[]>
    ) => {
      state.opportunities = action.payload;
    },
    // add a new one to the list
    addOpportunity: (state, action: PayloadAction<OpportunitiesCardType>) => {
      state.opportunities.push(action.payload);
    },
    // update by id
    updateOpportunity: (
      state,
      action: PayloadAction<OpportunitiesCardType>
    ) => {
      const index = state.opportunities.findIndex(
        (opp) => opp._id === action.payload._id
      );
      if (index !== -1) {
        state.opportunities[index] = action.payload;
      }
    },
    // remove by id
    removeOpportunity: (state, action: PayloadAction<number>) => {
      state.opportunities = state.opportunities.filter(
        (opp) => opp._id !== action.payload
      );
    },
  },
});

export const {
  setOpportunity,
  setOpportunities,
  addOpportunity,
  updateOpportunity,
  removeOpportunity,
  setQueryValue,
} = opportunitiesSlice.actions;

export default opportunitiesSlice.reducer;
