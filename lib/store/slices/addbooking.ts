import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LatLng {
  lat: number;
  lng: number;
}

export interface LocationData {
  address: string;
  coordinates: LatLng | null;
}

export interface Traveler {
  fullName: string;
  dob: string;
  nationality: string;
  passport: string;
}

interface BookingsState {
  selectDate: string | null;
  participants: string | null;

  email: string | null;
  fullName: string | null;
  phoneNumber: string | null;

  travelers: Traveler[];

  pickupLocation: LocationData | null;
}

const initialState: BookingsState = {
  selectDate: null,
  participants: null,

  email: null,
  fullName: null,
  phoneNumber: null,

  travelers: [
    {
      dob: "",
      fullName: "",
      nationality: "",
      passport: "",
    },
  ],

  pickupLocation: null,
};

export const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof BookingsState; value: any }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },

    addToArray: (
      state,
      action: PayloadAction<{ field: keyof BookingsState; value: any }>
    ) => {
      const arr = state[action.payload.field];
      if (Array.isArray(arr)) arr.push(action.payload.value);
    },

    updateArrayItem: (
      state,
      action: PayloadAction<{
        field: keyof BookingsState;
        index: number;
        key: string;
        value: any;
      }>
    ) => {
      const arr = state[action.payload.field];
      if (Array.isArray(arr) && arr[action.payload.index]) {
        (arr[action.payload.index] as any)[action.payload.key] =
          action.payload.value;
      }
    },

    removeArrayItem: (
      state,
      action: PayloadAction<{ field: keyof BookingsState; index: number }>
    ) => {
      const arr = state[action.payload.field];
      if (Array.isArray(arr)) arr.splice(action.payload.index, 1);
    },
  },
});

export const { setField, addToArray, updateArrayItem, removeArrayItem } =
  bookingsSlice.actions;

export default bookingsSlice.reducer;
