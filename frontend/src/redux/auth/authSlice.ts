import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState
} from "./authTypes";
import cookies from "../../utils/cookies";
import { loginUser, signupUser } from "./Thunks";
import { restoreUser } from "./Thunks/UserThunk";
import { deleteUserAccount, updateUserProfile } from "./Thunks/EditThunk";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to reset the authentication state
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    // Action to logout the user
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      cookies.remove("clb-tkn");
    },
  },
  extraReducers: (builder) => {
    // Handle login actions
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        cookies.set("clb-tkn", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Handle signup actions
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update profile
    builder
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.user = { ...state.user, ...action.payload };
        }
      )
      .addCase(
        updateUserProfile.rejected,
        (state, action: PayloadAction<any>) => {
          state.error = action.payload;
        }
      );

    // Delete account
    builder
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.user = null; // Set user to null upon deletion
      })
      .addCase(
        deleteUserAccount.rejected,
        (state, action: PayloadAction<any>) => {
          state.error = action.payload;
        }
      );

    // Restore user
    builder
      .addCase(restoreUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(restoreUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = cookies.get("clb-tkn");
        state.isAuthenticated = true;
      })
      .addCase(restoreUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAuthState, logout } = authSlice.actions;
export default authSlice.reducer;
