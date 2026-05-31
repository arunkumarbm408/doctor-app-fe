import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppNavbar from "./components/layout/AppNavbar";
import AppFooter from "./components/layout/AppFooter";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleRoute from "./components/common/RoleRoute";
import NotificationToast from "./components/common/NotificationToast";
import { fetchCurrentUser } from "./features/auth/authSlice";
import useSocketEvents from "./hooks/useSocketEvents";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DoctorRegisterPage = lazy(() => import("./pages/DoctorRegisterPage"));
const DoctorsPage = lazy(() => import("./pages/DoctorsPage"));
const DoctorDetailsPage = lazy(() => import("./pages/DoctorDetailsPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const CompleteProfilePage = lazy(() => import("./pages/CompleteProfilePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const HospitalPage = lazy(() => import("./pages/HospitalPage"));

let notifCounter = 0;
const makeNotif = (title, message, type = "info") => ({
  id: ++notifCounter,
  title,
  message,
  type,
});

const PageLoader = () => (
  <div
    className="flex items-center justify-center"
    style={{ minHeight: "50vh" }}
  >
    <span className="spinner-border text-primary" role="status" />
  </div>
);

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

  useEffect(() => {
    const token = localStorage.getItem("doctor-book-token");
    if (token) dispatch(fetchCurrentUser());
  }, [dispatch]);

  useSocketEvents(user, dispatch, addNotif);

  return (
    <div className="app-shell">
      <AppNavbar />
      <main className="app-main">
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </main>
      <AppFooter />
      <NotificationToast notifications={notifications} onDismiss={dismissNotif} />
    </div>
  );
};

export default App;
