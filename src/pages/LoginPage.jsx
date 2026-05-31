import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthError, loginUser } from "../features/auth/authSlice";

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
            {/* Brand */}
            <div className="text-center mb-5">
              {/* <Link to="/" className="brand-mark d-inline-flex justify-content-center mb-4">
<span className="text-start">
                  <strong>DocQ</strong>
                  <small>The touch of care</small>
                </span>
              </Link> */}
              <h1 className="page-title">Welcome back</h1>
              <p className="page-subtitle mt-1">
                Sign in to manage bookings, doctor workflows, or the admin dashboard.
              </p>
            </div>

            <Card className="border-0 premium-panel auth-card">
              <Card.Body className="p-4 p-md-5">
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
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-soft">Email address</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        className="form-control-soft ps-5"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    <div className="position-relative">
                      <Form.Control
                        className="form-control-soft ps-5"
                        type="password"
                        placeholder="Your password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
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

                <p
                  className="text-center mb-0"
                  style={{ fontSize: "0.875rem", color: "var(--text-3)" }}
                >
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{ color: "var(--teal-dark)", fontWeight: 700 }}
                  >
                    Create one free
                  </Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
