import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface VendorDetails {
  companyName: string;
  contactPersonName: string;
  businessEmail: string;
  password: string;
  confirmPassword: string;
  contactPhoneNumber: string;
  tursabNumber: string;
  address: {
    address?: string | undefined;
    coordinates?:
      | {
          lat?: number;
          lng?: number;
        }
      | undefined;
  };
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
      coordinates: undefined,
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
    agreedToTerms: false,
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
    setVendorAddress: (
      state,
      action: PayloadAction<{
        address: string;
        coordinates: { lat: number; lng: number } | undefined;
      }>
    ) => {
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
