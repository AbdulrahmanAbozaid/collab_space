import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../utils/Api";
import { emailCredentials, LoginCredentials, RegisterResponse, SignupData } from "../authTypes";

// Thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/login", credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk for user signup
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const response = await API.post<RegisterResponse>("/auth/register", data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk for verifyEmail
export const verifyEmail = createAsyncThunk(
    "auth/email",
    async (credentials: emailCredentials, { rejectWithValue }) => {
      try {
        const response = await API.post(`/auth/verify-email/${credentials.otp}`, credentials);
        return response;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );