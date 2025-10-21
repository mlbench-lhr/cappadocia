import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/authSlice";
import sidebarSlice from "./slices/sidebarSlice";
import generalSlice from "./slices/generalSlice";
import adminSlice from "./slices/adminSlice";
import opportunitySlice from "./slices/opportunitySlice";
import blogslice from "./slices/blogSlice";
import calendarSlice from "./slices/calendarSlice";
import notificationSlice from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    sidebar: sidebarSlice,
    general: generalSlice,
    admin: adminSlice,
    opportunity: opportunitySlice,
    blog: blogslice,
    calendar: calendarSlice,
    notification: notificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
