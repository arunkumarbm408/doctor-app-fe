import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { apiError } from "../../services/api";

export const bookAppointment = createAsyncThunk("appointments/book", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/appointments", payload);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchMyAppointments = createAsyncThunk("appointments/list", async (_, thunkAPI) => {
  try {
    // Backend-new uses /appointments/my (not /me)
    const { data } = await api.get("/appointments/my");
    return data.data?.appointments || data.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const cancelAppointment = createAsyncThunk("appointments/cancel", async (id, thunkAPI) => {
  try {
    // Backend-new uses PUT (not PATCH)
    const { data } = await api.put(`/appointments/${id}/cancel`);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const createRazorpayOrder = createAsyncThunk(
  "appointments/razorpayOrder",
  async (appointmentId, thunkAPI) => {
    try {
      const { data } = await api.post("/payments/razorpay/order", { appointmentId });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiError(error));
    }
  }
);

export const verifyRazorpayPayment = createAsyncThunk(
  "appointments/razorpayVerify",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/payments/razorpay/verify", payload);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiError(error));
    }
  }
);

export const submitPayment = createAsyncThunk("appointments/payment", async (formData, thunkAPI) => {
  try {
    // Extract fields from FormData (Backend-new expects JSON for payment creation)
    const appointmentId = formData.get("appointmentId");
    const utrId = formData.get("utrId") || "";
    const screenshot = formData.get("screenshot");

    // Step 1: Create payment record with JSON
    const { data } = await api.post("/payments", { appointmentId, utrId });
    const payment = data.data;

    // Step 2: Upload screenshot if provided
    if (screenshot && payment?._id) {
      const screenshotForm = new FormData();
      screenshotForm.append("screenshot", screenshot);
      if (utrId) screenshotForm.append("utrId", utrId);
      await api.post(`/payments/${payment._id}/screenshot`, screenshotForm);
    }

    return payment;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    loading: false,
    bookingLoading: false,
    error: null,
  },
  reducers: {
    receiveAppointmentUpdate(state, action) {
      state.appointments = state.appointments.map((a) =>
        a._id === action.payload._id ? { ...a, ...action.payload } : a
      );
    },
    receivePaymentVerified(state, action) {
      // action.payload: { appointmentId, status }
      if (!action.payload.appointmentId) return;
      state.appointments = state.appointments.map((a) =>
        a._id === action.payload.appointmentId
          ? { ...a, paymentStatus: action.payload.status === "Approved" ? "Paid" : "Pending" }
          : a
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bookAppointment.pending, (state) => {
        state.bookingLoading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.appointments.unshift(action.payload);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.bookingLoading = false;
        state.error = action.payload;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.map((appointment) =>
          appointment._id === action.payload._id ? action.payload : appointment
        );
      })
      .addCase(submitPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        const appointmentId = action.meta.arg?.appointmentId;
        if (!appointmentId) return;
        state.appointments = state.appointments.map((a) =>
          a._id === appointmentId ? { ...a, paymentStatus: "Paid", paymentMethod: "Razorpay" } : a
        );
      });
  },
});

export const { receiveAppointmentUpdate, receivePaymentVerified } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
