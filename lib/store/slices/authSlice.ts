import {
  AcademicInfo,
  DreamsAndGoals,
  extracurricularsAndAwards,
  PersonalInfo,
  User,
} from "@/lib/types/auth";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user:
    | (User & {
        personalInfo?: PersonalInfo;
        academicInfo?: AcademicInfo;
        dreamsAndGoals?: DreamsAndGoals;
        extracurricularsAndAwards?: extracurricularsAndAwards;
        role?: string;
      })
    | null;
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setReduxUser: (
      state,
      action: PayloadAction<NonNullable<AuthState["user"]>>
    ) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<AuthState["user"]>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setReduxUser, clearUser, updateUser } = authSlice.actions;

export default authSlice.reducer;
