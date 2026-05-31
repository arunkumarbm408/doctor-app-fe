import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthError, loginUser } from "../features/auth/authSlice";
import AuthLayout from "../components/layout/AuthLayout";
import ErrorAlert from "../components/common/ErrorAlert";
import IconInput from "../components/common/IconInput";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate(location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/dashboard"));
    }
    return () => dispatch(clearAuthError());
  }, [user, navigate, location.state, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage bookings, doctor workflows, or the admin dashboard."
    >
      <ErrorAlert message={error} />

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="form-label-soft">Email address</Form.Label>
          <IconInput
            icon="bi-envelope"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <Form.Label className="form-label-soft mb-0">Password</Form.Label>
            <Link
              to="/forgot-password"
              style={{ fontSize: "0.8rem", color: "var(--teal-dark)", fontWeight: 600 }}
            >
              Forgot password?
            </Link>
          </div>
          <IconInput
            icon="bi-lock"
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </Form.Group>
        <div className="mb-5" />

        <Button
          type="submit"
          className="w-100 pill-button btn-teal btn-soft-dark"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <i className="bi bi-arrow-right ms-2" />
            </>
          )}
        </Button>
      </Form>

      <hr className="my-4" style={{ borderColor: "var(--border)" }} />

      <p className="text-center mb-0" style={{ fontSize: "0.875rem", color: "var(--text-3)" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "var(--teal-dark)", fontWeight: 700 }}>
          Create one free
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
