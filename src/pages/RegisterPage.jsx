import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthError, registerUser } from "../features/auth/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", location: "" });

  useEffect(() => {
    if (user) navigate(user.role === "admin" ? "/admin" : "/dashboard");
    return () => dispatch(clearAuthError());
  }, [user, navigate, dispatch]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div style={{ background: "var(--bg-2)", minHeight: "100vh" }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={7} xl={6}>
            <div className="text-center mb-5">
              {/* <Link to="/" className="brand-mark d-inline-flex justify-content-center mb-4">
<span className="text-start">
                  <strong>DocQ</strong>
                  <small>The touch of care</small>
                </span>
              </Link> */}
              <h5 className="page-title">Create patient account</h5>
              <p className="page-subtitle mt-1">
                Sign up to book appointments with specialist doctors.
              </p>
            </div>

            <Card className="border-0 premium-panel auth-card">
              <Card.Body className="p-4 p-md-5">
                {error && (
                  <Alert variant="danger" className="d-flex align-items-center gap-2 py-2 mb-4" style={{ borderRadius: "var(--r-md)" }}>
                    <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
                    {error}
                  </Alert>
                )}

                <Form onSubmit={(e) => { e.preventDefault(); dispatch(registerUser(form)); }}>
                  <p className="mini-label mb-3">Personal information</p>
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Full name</Form.Label>
                      <Form.Control className="form-control-soft" placeholder="e.g. John Smith" value={form.name} onChange={set("name")} required />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Email address</Form.Label>
                      <Form.Control className="form-control-soft" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Password</Form.Label>
                      <Form.Control className="form-control-soft" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set("password")} required />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Phone number</Form.Label>
                      <Form.Control className="form-control-soft" placeholder="080-XXXXXXXX" value={form.phone} onChange={set("phone")} />
                    </Col>
                    <Col md={12}>
                      <Form.Label className="form-label-soft">City / Location</Form.Label>
                      <Form.Control className="form-control-soft" placeholder="e.g. Bengaluru" value={form.location} onChange={set("location")} />
                    </Col>
                  </Row>

                  <Button type="submit" className="pill-button btn-teal btn-soft-dark w-100" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status" />Creating account…</>
                    ) : (
                      <><i className="bi bi-person-plus me-2" />Create account</>
                    )}
                  </Button>
                </Form>

                <hr className="my-4" style={{ borderColor: "var(--border)" }} />

                <div className="text-center">
                  <p className="mb-2" style={{ fontSize: "0.875rem", color: "var(--text-3)" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "var(--teal-dark)", fontWeight: 700 }}>Sign in</Link>
                  </p>
                  <p className="mb-0" style={{ fontSize: "0.875rem", color: "var(--text-3)" }}>
                    Are you a doctor?{" "}
                    <Link to="/doctor-register" style={{ color: "var(--teal-dark)", fontWeight: 700 }}>
                      <i className="bi bi-person-badge me-1" />Join as Doctor
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
