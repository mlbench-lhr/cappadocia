import { LocationData } from "@/components/map";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface VendorDetails {
  companyName: string;
  contactPersonName: string;
  businessEmail: string;
  password: string;
  confirmPassword: string;
  contactPhoneNumber: string;
  tursabNumber: string;
  address: LocationData;
  documents: string[];
  aboutUs: string;
  languages: string[];
  paymentInfo: {
    ibanNumber: string;
    bankName: string;
    accountHolderName: string;
    currency: string;
  };
  agreedToTerms: boolean;
  cover?: string;
  stripeAccountId: string;
  rating: { average: number | 0; total: number | 0 };
}

interface VendorState {
  vendorDetails: VendorDetails;
}

const initialState: VendorState = {
  vendorDetails: {
    companyName: "",
    contactPersonName: "",
    businessEmail: "",
    password: "",
    confirmPassword: "",
    contactPhoneNumber: "",
    tursabNumber: "",
    address: {
      address: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    documents: [],
    aboutUs: "",
    languages: [],
    paymentInfo: {
      ibanNumber: "",
      bankName: "",
      accountHolderName: "",
      currency: "",
    },
    stripeAccountId: "",
    agreedToTerms: false,
    rating: { average: 0, total: 0 },
  },
};

export const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    // Set individual field
    setVendorField: (
      state,
      action: PayloadAction<{
        field: keyof VendorDetails;
        value: any;
      }>
    ) => {
      const { field, value } = action.payload;
      (state.vendorDetails[field] as any) = value;
    },

    // Update nested address object
    setVendorAddress: (state, action: PayloadAction<LocationData>) => {
      state.vendorDetails.address = action.payload;
    },

    // Add document to array
    addDocument: (state, action: PayloadAction<string>) => {
      state.vendorDetails.documents.push(action.payload);
    },

    // Remove document from array
    removeDocument: (state, action: PayloadAction<number>) => {
      state.vendorDetails.documents.splice(action.payload, 1);
    },

    // Add language to array
    addLanguage: (state, action: PayloadAction<string>) => {
      if (!state.vendorDetails.languages.includes(action.payload)) {
        state.vendorDetails.languages.push(action.payload);
      }
    },

    // Remove language from array
    removeLanguage: (state, action: PayloadAction<string>) => {
      state.vendorDetails.languages = state.vendorDetails.languages.filter(
        (lang) => lang !== action.payload
      );
    },

    // Update payment info
    setPaymentInfo: (
      state,
      action: PayloadAction<Partial<VendorDetails["paymentInfo"]>>
    ) => {
      state.vendorDetails.paymentInfo = {
        ...state.vendorDetails.paymentInfo,
        ...action.payload,
      };
    },

    // Reset vendor details
    resetVendorDetails: (state) => {
      state.vendorDetails = initialState.vendorDetails;
    },
  },
});

export const {
  setVendorField,
  setVendorAddress,
  addDocument,
  removeDocument,
  addLanguage,
  removeLanguage,
  setPaymentInfo,
  resetVendorDetails,
} = vendorSlice.actions;

export default vendorSlice.reducer;
