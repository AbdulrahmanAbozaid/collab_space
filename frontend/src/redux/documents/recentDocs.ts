import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axiosInstance from "../../utils/Api";

// Thunk to fetch documents for the authenticated user
export const fetchDocumentsThunk = createAsyncThunk(
  "documents/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/documents/me");
      return response.data.documents; // Return array of documents
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch documents"
      );
    }
  }
);

interface DocumentState {
  documents: Array<any>;
  isLoading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  isLoading: false,
  error: null,
};

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocumentsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocumentsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default documentSlice.reducer;
