import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthError, registerDoctor } from "../features/auth/authSlice";
import DoctorFirebaseUpload from "../components/doctor/DoctorFirebaseUpload";

const DoctorRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    experience: "",
    qualifications: "",
    clinicName: "",
    location: "",
    fees: "",
    licenseNumber: "",
    about: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (user) navigate(user.role === "admin" ? "/admin" : "/dashboard");
    return () => dispatch(clearAuthError());
  }, [user, navigate, dispatch]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (profileImage) formData.append("profileImage", profileImage);
      documents.forEach((doc) => formData.append("documents", doc));

      const result = await dispatch(registerDoctor(formData));
      if (!result.error) setSubmitted(true);
    } catch (err) {
      setUploadError(err.message || "Failed to upload files.");
    }
  };

  if (submitted) {
    return (
      <div style={{ background: "var(--bg-2)", minHeight: "100vh" }}>
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={7} xl={6}>
              <div className="text-center mb-5">
                <Link to="/" className="brand-mark d-inline-flex justify-content-center mb-4">
<span className="text-start">
                    <strong>DocQ</strong>
                    <small>The touch of care</small>
                  </span>
                </Link>
              </div>
              <Card className="border-0 premium-panel auth-card text-center">
                <Card.Body className="p-4 p-md-5">
                  <div
                    className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle"
                    style={{ width: 72, height: 72, background: "var(--teal-soft)", border: "2px solid var(--teal-border)" }}
                  >
                    <i className="bi bi-clock-history" style={{ fontSize: "2rem", color: "var(--teal)" }} />
                  </div>
                  <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>Application submitted!</h2>
                  <p className="mt-3" style={{ color: "var(--text-3)", lineHeight: 1.7 }}>
                    Your doctor registration is under review. You will receive an email once your
                    account is approved by the admin. This usually takes 1–2 business days.
                  </p>
                  <Button as={Link} to="/login" className="pill-button btn-teal mt-3">
                    <i className="bi bi-box-arrow-in-right me-2" />
                    Go to login
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-2)", minHeight: "100vh" }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={9} xl={8}>
            <div className="text-center mb-5">
              {/* <Link to="/" className="brand-mark d-inline-flex justify-content-center mb-4">
                <span className="brand-badge">DB</span>
                <span className="text-start">
                  <strong>DocQ</strong>
                  <small>The touch of care</small>
                </span>
              </Link> */}
              <h1 className="page-title">Join as a doctor</h1>
              <p className="page-subtitle mt-1">
                Submit your application to join our specialist network. Your profile will be reviewed and approved by the admin.
              </p>
            </div>

            <Card className="border-0 premium-panel auth-card">
              <Card.Body className="p-4 p-md-5">
                {(error || uploadError) && (
                  <Alert
                    variant="danger"
                    className="d-flex align-items-center gap-2 py-2 mb-4"
                    style={{ borderRadius: "var(--r-md)" }}
                  >
                    <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
                    {uploadError || error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Account credentials */}
                  <p className="mini-label mb-3">Account credentials</p>
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Full name</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        placeholder="Dr. John Smith"
                        value={form.name}
                        onChange={set("name")}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Email address</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        type="email"
                        placeholder="doctor@example.com"
                        value={form.email}
                        onChange={set("email")}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Phone number</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        placeholder="080-XXXXXXXX"
                        value={form.phone}
                        onChange={set("phone")}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Password</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        type="password"
                        placeholder="Min. 6 characters"
                        value={form.password}
                        onChange={set("password")}
                        required
                      />
                    </Col>
                  </Row>

                  {/* Professional details */}
                  <p className="mini-label mb-3">Professional details</p>
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Specialization</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        placeholder="e.g. Cardiology"
                        value={form.specialization}
                        onChange={set("specialization")}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Experience (years)</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        type="number"
                        min="0"
                        placeholder="e.g. 10"
                        value={form.experience}
                        onChange={set("experience")}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Qualifications</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        placeholder="MBBS, MD, DNB…"
                        value={form.qualifications}
                        onChange={set("qualifications")}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Consultation fees (₹)</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        type="number"
                        min="0"
                        placeholder="e.g. 500"
                        value={form.fees}
                        onChange={set("fees")}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">Clinic / Hospital name</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        placeholder="e.g. City Heart Institute"
                        value={form.clinicName}
                        onChange={set("clinicName")}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="form-label-soft">License / Registration number</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        placeholder="e.g. MCI-12345"
                        value={form.licenseNumber}
                        onChange={set("licenseNumber")}
                        required
                      />
                    </Col>
                    <Col md={12}>
                      <Form.Label className="form-label-soft">Clinic address / City</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        placeholder="e.g. Bengaluru, Karnataka"
                        value={form.location}
                        onChange={set("location")}
                        required
                      />
                    </Col>
                    <Col md={12}>
                      <Form.Label className="form-label-soft">About / Bio</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        as="textarea"
                        rows={3}
                        placeholder="Briefly describe your practice, care approach, and expertise…"
                        value={form.about}
                        onChange={set("about")}
                      />
                    </Col>
                  </Row>

                  {/* Documents */}
                  <p className="mini-label mb-3">Verification documents</p>
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <DoctorFirebaseUpload
                        mode="profileImage"
                        label="Profile photo"
                        helpText="JPG, PNG, or WEBP. Max 2MB."
                        uploading={loading}
                        onFilesChange={(files) => setProfileImage(files[0] || null)}
                      />
                    </Col>
                    <Col md={6}>
                      <DoctorFirebaseUpload
                        mode="certificate"
                        label="Supporting documents"
                        multiple
                        helpText="Medical license, certificates, or ID proof. Up to 5 PDFs/images, 5MB each."
                        uploading={loading}
                        onFilesChange={setDocuments}
                      />
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    className="pill-button btn-teal btn-soft-dark w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status" />Submitting application…</>
                    ) : (
                      <><i className="bi bi-send me-2" />Submit application</>
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
                    Registering as a patient?{" "}
                    <Link to="/register" style={{ color: "var(--teal-dark)", fontWeight: 700 }}>Patient sign-up</Link>
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

export default DoctorRegisterPage;
