import { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppNavbar from "./components/layout/AppNavbar";
import AppFooter from "./components/layout/AppFooter";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleRoute from "./components/common/RoleRoute";
import NotificationToast from "./components/common/NotificationToast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DoctorRegisterPage from "./pages/DoctorRegisterPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDetailsPage from "./pages/DoctorDetailsPage";
import BookingPage from "./pages/BookingPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import ProfilePage from "./pages/ProfilePage";
import ContactPage from "./pages/ContactPage";
import HospitalPage from "./pages/HospitalPage";
import { fetchCurrentUser, receiveDoctorApproval } from "./features/auth/authSlice";
import {
  receiveAppointmentUpdate,
  receivePaymentVerified,
} from "./features/appointments/appointmentsSlice";
import {
  receiveNewAppointment,
  receiveCancelledAppointment,
  receiveDoctorPaymentVerified,
} from "./features/doctors/doctorsSlice";
import {
  adminReceiveNewAppointment,
  adminReceiveAppointmentUpdate,
  adminReceiveNewPayment,
} from "./features/admin/adminSlice";
import { connectSocket, disconnectSocket } from "./services/socket";

let notifCounter = 0;
const makeNotif = (title, message, type = "info") => ({
  id: ++notifCounter,
  title,
  message,
  type,
});

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [notifications, setNotifications] = useState([]);

  const addNotif = useCallback((title, message, type) => {
    setNotifications((prev) => [...prev, makeNotif(title, message, type)]);
  }, []);

  const dismissNotif = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Fetch current user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("doctor-book-token");
    if (token) dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Connect/disconnect socket and register role-based event handlers
  useEffect(() => {
    if (!user) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket(user.id || user._id);

    const role = user.role;

    // ── PATIENT events ─────────────────────────────────────────────
    if (role === "patient") {
      // Doctor changed appointment status
      socket.on("appointment:updated", ({ appointment, message }) => {
        dispatch(receiveAppointmentUpdate(appointment));
        addNotif("Appointment Update", message, "info");
      });

      // Admin verified/rejected payment
      socket.on("payment:verified", ({ appointmentId, status, message }) => {
        dispatch(receivePaymentVerified({ appointmentId, status }));
        addNotif(
          "Payment Update",
          message,
          status === "Approved" ? "success" : "danger"
        );
      });
    }

    // ── DOCTOR events ───────────────────────────────────────────────
    if (role === "doctor") {
      // Patient booked a new appointment
      socket.on("appointment:new", ({ appointment, message }) => {
        dispatch(receiveNewAppointment(appointment));
        addNotif("New Appointment", message, "success");
      });

      // Patient cancelled an appointment
      socket.on("appointment:cancelled", ({ appointment, message }) => {
        dispatch(receiveCancelledAppointment(appointment));
        addNotif("Appointment Cancelled", message, "warning");
      });

      // Admin approved or rejected the doctor's profile
      socket.on("doctor:approved", ({ isApproved, message }) => {
        dispatch(receiveDoctorApproval({ isApproved }));
        addNotif(
          isApproved ? "Profile Approved" : "Profile Rejected",
          message,
          isApproved ? "success" : "danger"
        );
      });

      // Admin verified or rejected a patient's payment
      socket.on("payment:verified", ({ appointmentId, status, message }) => {
        dispatch(receiveDoctorPaymentVerified({ appointmentId, status }));
        addNotif(
          "Payment Update",
          message,
          status === "Approved" ? "success" : "warning"
        );
      });
    }

    // ── ADMIN events ────────────────────────────────────────────────
    if (role === "admin") {
      // Patient booked a new appointment
      socket.on("appointment:new", ({ appointment, message }) => {
        dispatch(adminReceiveNewAppointment(appointment));
        addNotif("New Appointment", message, "info");
      });

      // Doctor updated an appointment status
      socket.on("appointment:updated", ({ appointment, message }) => {
        dispatch(adminReceiveAppointmentUpdate(appointment));
        addNotif("Appointment Updated", message, "info");
      });

      // Patient cancelled an appointment
      socket.on("appointment:cancelled", ({ appointment, message }) => {
        dispatch(adminReceiveAppointmentUpdate(appointment));
        addNotif("Appointment Cancelled", message, "warning");
      });

      // Patient submitted a new payment
      socket.on("payment:new", ({ payment, message }) => {
        dispatch(adminReceiveNewPayment(payment));
        addNotif("New Payment", message, "warning");
      });
    }

    return () => {
      socket.off("appointment:new");
      socket.off("appointment:updated");
      socket.off("appointment:cancelled");
      socket.off("doctor:approved");
      socket.off("payment:new");
      socket.off("payment:verified");
    };
  }, [user, dispatch, addNotif]);

  return (
    <div className="app-shell">
      <AppNavbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/doctor-register" element={<DoctorRegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute>
                <CompleteProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailsPage />} />
          <Route
            path="/booking/:id"
            element={
              <ProtectedRoute>
                <RoleRoute roles={["patient"]}>
                  <BookingPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <RoleRoute roles={["doctor"]}>
                  <ProfilePage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleRoute roles={["admin"]}>
                  <AdminPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route path="/hospitals/:hospitalId" element={<HospitalPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <AppFooter />
      <NotificationToast notifications={notifications} onDismiss={dismissNotif} />
    </div>
  );
};

export default App;
