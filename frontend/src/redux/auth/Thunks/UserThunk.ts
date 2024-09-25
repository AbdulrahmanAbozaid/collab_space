import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../utils/Api";

// restore current user's account
export const restoreUser = createAsyncThunk(
    "auth/restore",
    async (_, { rejectWithValue }) => {
      try {
        const res = await API.get("/user/me");
        return res;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );