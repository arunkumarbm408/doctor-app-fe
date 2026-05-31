import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { apiError } from "../../services/api";

export const fetchDoctors = createAsyncThunk("doctors/list", async (params = {}, thunkAPI) => {
  try {
    const { data } = await api.get("/doctors", { params });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchSpecializations = createAsyncThunk(
  "doctors/specializations",
  async (params = {}, thunkAPI) => {
    try {
      const { data } = await api.get("/doctors/meta/specializations", { params });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiError(error));
    }
  }
);

export const fetchLocations = createAsyncThunk("doctors/locations", async (params = {}, thunkAPI) => {
  try {
    const { data } = await api.get("/doctors/meta/locations", { params });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchMyDoctorProfile = createAsyncThunk("doctors/myProfile", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/doctors/me/profile");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchDoctorDetails = createAsyncThunk("doctors/details", async (id, thunkAPI) => {
  try {
    const { data } = await api.get(`/doctors/${id}`);
    // Backend-new returns { doctor, bookedSlots }
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const saveDoctorProfile = createAsyncThunk("doctors/saveProfile", async (formData, thunkAPI) => {
  try {
    // Let axios set Content-Type automatically (multipart boundary is handled correctly)
    const { data } = await api.put("/doctors/me/profile", formData);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const uploadDoctorDocuments = createAsyncThunk("doctors/uploadDocuments", async (formData, thunkAPI) => {
  try {
    const { data } = await api.post("/doctors/me/documents", formData);
    return data.data?.documents || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchDoctorAppointments = createAsyncThunk("doctors/appointments", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/doctors/me/appointments");
    // Backend-new returns { total, appointments }
    return data.data?.appointments || data.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const saveAvailability = createAsyncThunk("doctors/saveAvailability", async (slots, thunkAPI) => {
  try {
    const { data } = await api.post("/doctors/me/availability", { slots });
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const updateAppointmentStatus = createAsyncThunk(
  "doctors/updateStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      // Backend-new: PUT /doctors/me/appointments/:id/status
      const { data } = await api.put(`/doctors/me/appointments/${id}/status`, { status });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiError(error));
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    specializations: [],
    locations: [],
    doctor: null,
    bookedSlots: [],
    pagination: null,
    doctorAppointments: [],
    loading: false,
    metaLoading: false,
    actionLoading: false,
    error: null,
    saveSuccess: false,
    availLoading: false,
    availError: null,
    availSuccess: false,
  },
  reducers: {
    clearSaveStatus(state) {
      state.saveSuccess = false;
      state.error = null;
    },
    clearAvailStatus(state) {
      state.availSuccess = false;
      state.availError = null;
    },
    receiveNewAppointment(state, action) {
      state.doctorAppointments.unshift(action.payload);
    },
    receiveCancelledAppointment(state, action) {
      state.doctorAppointments = state.doctorAppointments.map((a) =>
        a._id === action.payload._id ? { ...a, status: "Cancelled" } : a
      );
    },
    receiveDoctorPaymentVerified(state, action) {
      // action.payload: { appointmentId, status }
      if (!action.payload.appointmentId) return;
      state.doctorAppointments = state.doctorAppointments.map((a) =>
        a._id === action.payload.appointmentId
          ? { ...a, paymentStatus: action.payload.status === "Approved" ? "Paid" : "Pending" }
          : a
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        // Backend-new returns { status, message, data: { total, doctors } }
        state.doctors = action.payload.data?.doctors || action.payload.data || [];
        state.pagination = action.payload.data?.total
          ? { total: action.payload.data.total }
          : action.payload.pagination || null;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDoctorProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchMyDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSpecializations.pending, (state) => {
        state.metaLoading = true;
      })
      .addCase(fetchSpecializations.fulfilled, (state, action) => {
        state.metaLoading = false;
        state.specializations = action.payload.data || [];
      })
      .addCase(fetchSpecializations.rejected, (state) => {
        state.metaLoading = false;
        state.specializations = [];
      })
      .addCase(fetchLocations.pending, (state) => {
        state.metaLoading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.metaLoading = false;
        state.locations = action.payload.data || [];
      })
      .addCase(fetchLocations.rejected, (state) => {
        state.metaLoading = false;
        state.locations = [];
      })
      .addCase(fetchDoctorDetails.fulfilled, (state, action) => {
        // Backend-new returns { doctor, bookedSlots }
        state.doctor = action.payload?.doctor || action.payload;
        state.bookedSlots = action.payload?.bookedSlots || [];
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.doctorAppointments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(saveDoctorProfile.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(saveDoctorProfile.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.doctor = action.payload;
        state.saveSuccess = true;
      })
      .addCase(saveDoctorProfile.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(uploadDoctorDocuments.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(uploadDoctorDocuments.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (state.doctor) state.doctor.documents = action.payload;
        state.saveSuccess = true;
      })
      .addCase(uploadDoctorDocuments.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(saveAvailability.pending, (state) => {
        state.availLoading = true;
        state.availError = null;
        state.availSuccess = false;
      })
      .addCase(saveAvailability.fulfilled, (state, action) => {
        state.availLoading = false;
        state.availSuccess = true;
        if (state.doctor) state.doctor.availabilitySlots = action.payload;
      })
      .addCase(saveAvailability.rejected, (state, action) => {
        state.availLoading = false;
        state.availError = action.payload;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.doctorAppointments = state.doctorAppointments.map((appointment) =>
          appointment._id === action.payload._id ? action.payload : appointment
        );
      });
  },
});

export const { receiveNewAppointment, receiveCancelledAppointment, receiveDoctorPaymentVerified, clearSaveStatus, clearAvailStatus } = doctorsSlice.actions;
export default doctorsSlice.reducer;
