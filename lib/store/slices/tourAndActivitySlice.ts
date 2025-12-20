import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocationData } from "@/components/map";

// Types matching your mongoose schema
export interface Slot {
  _id?: string;
  startDate: Date;
  endDate: Date;
  adultPrice: number;
  childPrice: number;
  seatsAvailable: number;
}

export interface ToursAndActivityState {
  vendor: string | null;
  title: string;
  category?: "Tour" | "Activity";
  description?: string;
  uploads: string[];
  languages: string[];
  pickupAvailable: boolean;
  allowPayLater: boolean;
  included: string[];
  notIncluded: string[];
  itinerary: string[];
  cancellationPolicy: string;
  duration: number;
  durationStartTime: string;
  durationEndTime: string;
  slots: Slot[];
  stopBookingDates: Date[];
  location?: LocationData;
  active: boolean;
  status: "pending admin approval" | "active" | "rejected" | "upcoming";
  rating: { average: number | 0; total: number | 0 };
}

const initialState: ToursAndActivityState = {
  vendor: null,
  title: "",
  category: "Tour",
  description: "",
  uploads: [],
  languages: [],
  pickupAvailable: false,
  allowPayLater: false,
  included: [],
  notIncluded: [],
  itinerary: [],
  active: true,
  status: "pending admin approval",
  cancellationPolicy: "",
  duration: 0,
  durationStartTime: "",
  durationEndTime: "",
  location: {
    address: "",
    coordinates: null,
  },
  slots: [
    {
      startDate: new Date("2025-12-10"),
      endDate: new Date("2026-12-15"),
      adultPrice: 130,
      childPrice: 60,
      seatsAvailable: 40,
    },
  ],
  stopBookingDates: [],
  rating: { average: 0, total: 0 },
};

// Identify array-only fields
type ArrayFieldKey =
  | "uploads"
  | "languages"
  | "included"
  | "notIncluded"
  | "itinerary";

// Payload Types
interface SetFieldPayload {
  field: keyof ToursAndActivityState;
  value: ToursAndActivityState[keyof ToursAndActivityState];
}

interface ArrayAddPayload {
  field: ArrayFieldKey;
  value: string;
}

interface ArrayEditPayload {
  field: ArrayFieldKey;
  index: number;
  value: string;
}

interface ArrayDeletePayload {
  field: ArrayFieldKey;
  index: number;
}

const toursAndActivitySlice = createSlice({
  name: "toursActivity",
  initialState,
  reducers: {
    // Generic setter for simple fields
    setField: (state, action: PayloadAction<SetFieldPayload>) => {
      const { field, value } = action.payload;
      (state as any)[field] = value;
    },

    // Add item to array field
    addArrayItem: (state, action: PayloadAction<ArrayAddPayload>) => {
      const { field, value } = action.payload;
      state[field].push(value);
    },

    // Edit specific array item
    editArrayItem: (state, action: PayloadAction<ArrayEditPayload>) => {
      const { field, index, value } = action.payload;
      if (state[field][index] !== undefined) {
        state[field][index] = value;
      }
    },

    // Delete array item
    deleteArrayItem: (state, action: PayloadAction<ArrayDeletePayload>) => {
      const { field, index } = action.payload;
      state[field].splice(index, 1);
    },

    // Update nested slots object (fully typed)
    setSlotField: (state, action: PayloadAction<Slot[]>) => {
      state.slots = action.payload;
    },

    resetState: () => initialState,
  },
});

export const {
  setField,
  addArrayItem,
  editArrayItem,
  deleteArrayItem,
  setSlotField,
  resetState,
} = toursAndActivitySlice.actions;

export default toursAndActivitySlice.reducer;
