import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  settingOpen: boolean;
}

const initialState: SidebarState = {
  isOpen: false,
  isCollapsed: false,
  settingOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.isOpen = true;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
    toggleSetting: (state) => {
      state.settingOpen = !state.settingOpen;
    },
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    toggleCollapse: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
  },
});

export const {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  toggleCollapse,
  toggleSetting,
} = sidebarSlice.actions;
export default sidebarSlice.reducer;
