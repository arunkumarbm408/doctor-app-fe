import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPassword, clearForgotPassword } from "../features/auth/authSlice";

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
              <h1 className="page-title">Forgot Password</h1>
              <p className="page-subtitle mt-1">
                Enter your registered email and we'll send you a reset link.
              </p>
            </div>

            <Card className="border-0 premium-panel auth-card">
              <Card.Body className="p-4 p-md-5">
                {sent ? (
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
                      <i className="bi bi-envelope-check" style={{ fontSize: "1.8rem", color: "var(--teal-dark)" }} />
                    </div>
                    <h5 style={{ color: "var(--text-1)", fontWeight: 700 }}>Check your inbox</h5>
                    <p style={{ color: "var(--text-3)", fontSize: "0.9rem", margin: "8px 0 24px" }}>
                      If that email is registered, a reset link has been sent. The link expires in 1 hour.
                    </p>
                    <Link
                      to="/login"
                      className="pill-button btn-teal btn-soft-dark"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 28px", borderRadius: 4, textDecoration: "none", fontWeight: 700, fontSize: "0.9rem" }}
                    >
                      <i className="bi bi-arrow-left" /> Back to Sign In
                    </Link>
                  </div>
                ) : (
                  <>
                    {error && (
                      <Alert
                        variant="danger"
                        className="d-flex align-items-center gap-2 py-2 mb-4"
                        style={{ borderRadius: "var(--r-md)" }}
                      >
                        <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
                        {error}
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-4">
                        <Form.Label className="form-label-soft">Email address</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            className="form-control-soft ps-5"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <i
                            className="bi bi-envelope position-absolute"
                            style={{
                              left: "1rem",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "var(--text-4)",
                            }}
                          />
                        </div>
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;
