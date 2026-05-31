import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { apiError } from "../../services/api";

export const fetchAdminStats = createAsyncThunk("admin/stats", async (_, thunkAPI) => {
  try {
    // Backend-new: GET /admin/dashboard
    const { data } = await api.get("/admin/dashboard");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchUsers = createAsyncThunk("admin/users", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/admin/users");
    return data.data?.users || data.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchAdminDoctors = createAsyncThunk("admin/doctors", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/admin/doctors");
    return data.data?.doctors || data.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchAllAppointments = createAsyncThunk("admin/appointments", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/admin/appointments");
    return data.data?.appointments || data.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const toggleDoctorApproval = createAsyncThunk(
  "admin/toggleApproval",
  async ({ id, isApproved, rejectionReason }, thunkAPI) => {
    try {
      const { data } = await api.put(`/admin/doctors/${id}/approve`, { isApproved, rejectionReason });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiError(error));
    }
  }
);

export const fetchPendingPayments = createAsyncThunk("admin/pendingPayments", async (_, thunkAPI) => {
  try {
    // Backend-new: GET /admin/payments?status=Pending
    const { data } = await api.get("/admin/payments", { params: { status: "Pending" } });
    return data.data?.payments || data.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const requestDoctorInfo = createAsyncThunk(
  "admin/requestDoctorInfo",
  async ({ id, message }, thunkAPI) => {
    try {
      const { data } = await api.post(`/admin/doctors/${id}/request-info`, { message });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiError(error));
    }
  }
);

export const verifyAdminPayment = createAsyncThunk(
  "admin/verifyPayment",
  async ({ id, isApproved, adminNote }, thunkAPI) => {
    try {
      // Backend-new: PUT /payments/:id/status with { status: "Approved"|"Rejected" }
      const status = isApproved ? "Approved" : "Rejected";
      const { data } = await api.put(`/payments/${id}/status`, { status, adminNote });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiError(error));
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    users: [],
    doctors: [],
    appointments: [],
    payments: [],
    loading: false,
    error: null,
  },
  reducers: {
    adminReceiveNewAppointment(state, action) {
      state.appointments.unshift(action.payload);
      if (state.stats) state.stats.appointments = (state.stats.appointments || 0) + 1;
    },
    adminReceiveAppointmentUpdate(state, action) {
      state.appointments = state.appointments.map((a) =>
        a._id === action.payload._id ? { ...a, ...action.payload } : a
      );
    },
    adminReceiveNewPayment(state, action) {
      state.payments.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      // Normalize Backend-new dashboard shape → shape AdminPage expects
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        const raw = action.payload;
        state.stats = {
          users: raw?.users?.total || 0,
          doctors: (raw?.doctors?.approved || 0) + (raw?.doctors?.pending || 0),
          approvedDoctors: raw?.doctors?.approved || 0,
          appointments: raw?.appointments?.total || 0,
        };
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminDoctors.fulfilled, (state, action) => {
        state.doctors = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.appointments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(toggleDoctorApproval.fulfilled, (state, action) => {
        state.doctors = state.doctors.map((doctor) =>
          doctor._id === action.payload._id ? action.payload : doctor
        );
      })
      .addCase(requestDoctorInfo.fulfilled, (state, action) => {
        state.doctors = state.doctors.map((doctor) =>
          doctor._id === action.payload._id ? action.payload : doctor
        );
      })
      .addCase(fetchPendingPayments.fulfilled, (state, action) => {
        state.payments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(verifyAdminPayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter((p) => p._id !== action.payload._id);
      });
  },
});

export const {
  adminReceiveNewAppointment,
  adminReceiveAppointmentUpdate,
  adminReceiveNewPayment,
} = adminSlice.actions;
export default adminSlice.reducer;
