import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPassword, clearForgotPassword } from "../features/auth/authSlice";
import AuthLayout from "../components/layout/AuthLayout";
import ErrorAlert from "../components/common/ErrorAlert";
import IconInput from "../components/common/IconInput";

const successIconStyle = {
  width: 64,
  height: 64,
  borderRadius: "50%",
  background: "var(--teal-light, #e6faf8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px",
};

const backLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 28px",
  borderRadius: 4,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "0.9rem",
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { loading, error, sent } = useSelector((state) => state.auth.forgotPassword);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => dispatch(clearForgotPassword());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your registered email and we'll send you a reset link."
    >
      {sent ? (
        <div className="text-center py-3">
          <div style={successIconStyle}>
            <i
              className="bi bi-envelope-check"
              style={{ fontSize: "1.8rem", color: "var(--teal-dark)" }}
            />
          </div>
          <h5 style={{ color: "var(--text-1)", fontWeight: 700 }}>Check your inbox</h5>
          <p style={{ color: "var(--text-3)", fontSize: "0.9rem", margin: "8px 0 24px" }}>
            If that email is registered, a reset link has been sent. The link expires in 1 hour.
          </p>
          <Link
            to="/login"
            className="pill-button btn-teal btn-soft-dark"
            style={backLinkStyle}
          >
            <i className="bi bi-arrow-left" /> Back to Sign In
          </Link>
        </div>
      ) : (
        <>
          <ErrorAlert message={error} />

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="form-label-soft">Email address</Form.Label>
              <IconInput
                icon="bi-envelope"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  Sending…
                </>
              ) : (
                <>
                  Send Reset Link
                  <i className="bi bi-send ms-2" />
                </>
              )}
            </Button>
          </Form>

          <hr className="my-4" style={{ borderColor: "var(--border)" }} />

          <p className="text-center mb-0" style={{ fontSize: "0.875rem", color: "var(--text-3)" }}>
            Remember your password?{" "}
            <Link to="/login" style={{ color: "var(--teal-dark)", fontWeight: 700 }}>
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
