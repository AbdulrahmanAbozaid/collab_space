import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../utils/Api";

// Update the current user's profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    userData: { username: string; email: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.put("/user/me", userData); // PATCH /user/me route
      return (response as any).user; // Assuming the user object is returned
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete the current user's account
export const deleteUserAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      await API.delete("/user/me"); // DELETE /user/me route
      return true; // Return success or boolean to indicate account was deleted
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
