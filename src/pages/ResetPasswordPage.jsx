import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { resetPassword, clearResetPassword } from "../features/auth/authSlice";
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

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [form, setForm] = useState({ newPassword: "", confirm: "" });
  const [validationError, setValidationError] = useState("");
  const { loading, error, done } = useSelector((state) => state.auth.resetPassword);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => dispatch(clearResetPassword());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      setValidationError("Passwords do not match.");
      return;
    }
    setValidationError("");
    dispatch(resetPassword({ token, newPassword: form.newPassword }));
  };

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Choose a strong password for your account."
    >
      {done ? (
        <div className="text-center py-3">
          <div style={successIconStyle}>
            <i
              className="bi bi-shield-check"
              style={{ fontSize: "1.8rem", color: "var(--teal-dark)" }}
            />
          </div>
          <h5 style={{ color: "var(--text-1)", fontWeight: 700 }}>Password Updated</h5>
          <p style={{ color: "var(--text-3)", fontSize: "0.9rem", margin: "8px 0 24px" }}>
            Your password has been reset. You can now sign in with your new password.
          </p>
          <Link
            to="/login"
            className="pill-button btn-teal btn-soft-dark"
            style={backLinkStyle}
          >
            <i className="bi bi-box-arrow-in-right" /> Sign In
          </Link>
        </div>
      ) : (
        <>
          <ErrorAlert message={validationError || error} />

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-soft">New Password</Form.Label>
              <IconInput
                icon="bi-lock"
                type="password"
                placeholder="Min. 6 characters"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                minLength={6}
                required
              />
            </Form.Group>

            <Form.Group className="mb-5">
              <Form.Label className="form-label-soft">Confirm Password</Form.Label>
              <IconInput
                icon="bi-lock-fill"
                type="password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={(e) => {
                  setValidationError("");
                  setForm({ ...form, confirm: e.target.value });
                }}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 pill-button btn-teal btn-soft-dark"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Updating…
                </>
              ) : (
                <>
                  Update Password
                  <i className="bi bi-arrow-right ms-2" />
                </>
              )}
            </Button>
          </Form>

          <hr className="my-4" style={{ borderColor: "var(--border)" }} />

          <p className="text-center mb-0" style={{ fontSize: "0.875rem", color: "var(--text-3)" }}>
            Remembered it?{" "}
            <Link to="/login" style={{ color: "var(--teal-dark)", fontWeight: 700 }}>
              Back to Sign In
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
