import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface NotificationIndicatorState {
  hasNew: boolean;
  count: number;
}

const initialState: NotificationIndicatorState = {
  hasNew: false,
  count: 0,
};

const notificationIndicatorSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setHasNew(state, action: PayloadAction<boolean>) {
      state.hasNew = action.payload;
    },
    setCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
    clearNotificationsIndicator(state) {
      state.hasNew = false;
      state.count = 0;
    },
  },
});

export const { setHasNew, setCount, clearNotificationsIndicator } =
  notificationIndicatorSlice.actions;
export default notificationIndicatorSlice.reducer;
