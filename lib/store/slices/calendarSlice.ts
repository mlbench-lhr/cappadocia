import { CalendarType } from "@/lib/types/calendar";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- State ---
interface OpportunitiesState {
  events: CalendarType[];
}

const initialState: OpportunitiesState = {
  events: [],
};

// --- Slice ---
const opportunitiesSlice = createSlice({
  name: "opportunities",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<CalendarType[]>) => {
      state.events = action.payload;
    },
  },
});

export const { setEvents } = opportunitiesSlice.actions;

export default opportunitiesSlice.reducer;
