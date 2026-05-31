import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { resetPassword, clearResetPassword } from "../features/auth/authSlice";

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
    <div
      style={{
        background: "var(--bg-2)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={9} lg={7} xl={5}>
            <div className="text-center mb-5">
              {/* <Link to="/" className="brand-mark d-inline-flex justify-content-center mb-4">
<span className="text-start">
                  <strong>DocQ</strong>
                  <small>The touch of care</small>
                </span>
              </Link> */}
              <h1 className="page-title">Set New Password</h1>
              <p className="page-subtitle mt-1">
                Choose a strong password for your account.
              </p>
            </div>

            <Card className="border-0 premium-panel auth-card">
              <Card.Body className="p-4 p-md-5">
                {done ? (
                  <div className="text-center py-3">
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "var(--teal-light, #e6faf8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                      }}
                    >
                      <i className="bi bi-shield-check" style={{ fontSize: "1.8rem", color: "var(--teal-dark)" }} />
                    </div>
                    <h5 style={{ color: "var(--text-1)", fontWeight: 700 }}>Password Updated</h5>
                    <p style={{ color: "var(--text-3)", fontSize: "0.9rem", margin: "8px 0 24px" }}>
                      Your password has been reset. You can now sign in with your new password.
                    </p>
                    <Link
                      to="/login"
                      className="pill-button btn-teal btn-soft-dark"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 28px", borderRadius: 4, textDecoration: "none", fontWeight: 700, fontSize: "0.9rem" }}
                    >
                      <i className="bi bi-box-arrow-in-right" /> Sign In
                    </Link>
                  </div>
                ) : (
                  <>
                    {(error || validationError) && (
                      <Alert
                        variant="danger"
                        className="d-flex align-items-center gap-2 py-2 mb-4"
                        style={{ borderRadius: "var(--r-md)" }}
                      >
                        <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
                        {validationError || error}
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-soft">New Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            className="form-control-soft ps-5"
                            type="password"
                            placeholder="Min. 6 characters"
                            value={form.newPassword}
                            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                            minLength={6}
                            required
                          />
                          <i
                            className="bi bi-lock position-absolute"
                            style={{
                              left: "1rem",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "var(--text-4)",
                            }}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-5">
                        <Form.Label className="form-label-soft">Confirm Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            className="form-control-soft ps-5"
                            type="password"
                            placeholder="Repeat your password"
                            value={form.confirm}
                            onChange={(e) => {
                              setValidationError("");
                              setForm({ ...form, confirm: e.target.value });
                            }}
                            required
                          />
                          <i
                            className="bi bi-lock-fill position-absolute"
                            style={{
                              left: "1rem",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "var(--text-4)",
                            }}
                          />
                        </div>
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
