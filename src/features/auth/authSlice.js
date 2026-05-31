import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { apiError } from "../../services/api";

const storedUser = localStorage.getItem("doctor-book-user");

export const loginUser = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const registerUser = createAsyncThunk("auth/register", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const registerDoctor = createAsyncThunk("auth/doctorRegister", async (formData, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/doctor-register", formData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/forgot-password", payload);
    return data.message;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, newPassword }, thunkAPI) => {
  try {
    const { data } = await api.post(`/auth/reset-password/${token}`, { newPassword });
    return data.message;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchCurrentUser = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/auth/me");
    // Backend-new returns { user, doctorProfile }
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    doctorProfile: null,
    token: localStorage.getItem("doctor-book-token"),
    loading: false,
    error: null,
    forgotPassword: { loading: false, error: null, sent: false },
    resetPassword: { loading: false, error: null, done: false },
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.doctorProfile = null;
      state.token = null;
      localStorage.removeItem("doctor-book-token");
      localStorage.removeItem("doctor-book-user");
    },
    clearAuthError(state) {
      state.error = null;
    },
    clearForgotPassword(state) {
      state.forgotPassword = { loading: false, error: null, sent: false };
    },
    clearResetPassword(state) {
      state.resetPassword = { loading: false, error: null, done: false };
    },
    receiveDoctorApproval(state, action) {
      if (state.doctorProfile) {
        state.doctorProfile.isApproved = action.payload.isApproved;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("doctor-book-token", action.payload.token);
        localStorage.setItem("doctor-book-user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("doctor-book-token", action.payload.token);
        localStorage.setItem("doctor-book-user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerDoctor.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Backend-new /auth/me returns { user, doctorProfile }
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPassword = { loading: true, error: null, sent: false };
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPassword = { loading: false, error: null, sent: true };
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPassword = { loading: false, error: action.payload, sent: false };
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword = { loading: true, error: null, done: false };
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPassword = { loading: false, error: null, done: true };
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword = { loading: false, error: action.payload, done: false };
      })
      .addCase("doctors/myProfile/fulfilled", (state, action) => {
        if (action.payload) state.doctorProfile = action.payload;
      })
      .addCase("doctors/saveProfile/fulfilled", (state, action) => {
        if (action.payload) state.doctorProfile = action.payload;
      })
      .addCase("doctors/saveAvailability/fulfilled", (state, action) => {
        if (state.doctorProfile && action.payload) {
          state.doctorProfile.availabilitySlots = action.payload;
        }
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.doctorProfile = action.payload.doctorProfile;
        if (action.payload.user) {
          localStorage.setItem("doctor-book-user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.doctorProfile = null;
        localStorage.removeItem("doctor-book-token");
        localStorage.removeItem("doctor-book-user");
      });
  },
});

export const { logout, clearAuthError, clearForgotPassword, clearResetPassword, receiveDoctorApproval, setDoctorRegisterLoading } = authSlice.actions;
export default authSlice.reducer;
