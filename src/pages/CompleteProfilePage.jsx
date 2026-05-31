import { useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import WeeklySchedule from "../components/doctor/WeeklySchedule";

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { user, doctorProfile } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!user || user.role !== "doctor") { navigate("/"); return; }
    if (!doctorProfile?.isApproved) { navigate("/dashboard"); return; }
    if (doctorProfile?.availabilitySlots?.length > 0) { navigate("/dashboard"); }
  }, [user, doctorProfile, navigate]);

  const handleSaved = () => navigate("/dashboard");

  return (
    <div style={{ background: "var(--bg-2, #f0f4f8)", minHeight: "100vh", paddingBottom: 60 }}>
      <Container className="py-5">
        {/* Header */}
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "var(--teal-soft)",
                border: "2px solid var(--teal-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <i className="bi bi-shield-check" style={{ fontSize: "2.2rem", color: "var(--teal-dark)" }} />
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(13,148,136,0.1)",
                color: "var(--teal-dark)",
                padding: "4px 14px",
                borderRadius: 4,
                fontSize: "0.78rem",
                fontWeight: 700,
                marginBottom: 12,
                border: "1px solid var(--teal-border)",
              }}
            >
              <i className="bi bi-check-circle-fill" />
              Account Approved
            </div>

            <h1 className="page-title">Welcome to DocQ!</h1>
            <p className="page-subtitle mt-2" style={{ maxWidth: 520, margin: "8px auto 0" }}>
              Hi Dr. <strong>{user?.name}</strong> — one last step before patients can start booking with you.
              Set your weekly availability below.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={7}>
            <Card
              className="border-0 premium-panel"
              style={{ borderRadius: "var(--r-xl, 16px)", overflow: "hidden" }}
            >
              {/* Card header */}
              <div
                style={{
                  background: "linear-gradient(115deg, #075f9a 0%, #8c2964 55%, #c8172f 100%)",
                  padding: "22px 28px",
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                  }}
                >
                  <i className="bi bi-calendar3 me-2" />
                  Set Your Weekly Availability
                </h5>
                <p style={{ margin: "5px 0 0", color: "rgba(255,255,255,0.75)", fontSize: "0.85rem" }}>
                  Choose which days and times you are available to see patients.
                </p>
              </div>

              <Card.Body className="p-4">
                {/* Tip box */}
                <div
                  className="d-flex gap-3 p-3 mb-4"
                  style={{
                    background: "var(--teal-soft)",
                    border: "1px solid var(--teal-border)",
                    borderRadius: "var(--r-md, 8px)",
                    fontSize: "0.82rem",
                    color: "var(--teal-dark)",
                  }}
                >
                  <i className="bi bi-lightbulb-fill flex-shrink-0 mt-1" />
                  <div>
                    <strong>How it works:</strong> Toggle a day on to activate it, then click{" "}
                    <strong>"Add Slot"</strong> to set a time range. You can add multiple slots per
                    day (e.g. 9:00–12:00 and 15:00–18:00). Set max patients per slot to control your workload.
                  </div>
                </div>

                <WeeklySchedule onSaved={handleSaved} />
              </Card.Body>
            </Card>

            <p className="text-center mt-4" style={{ fontSize: "0.85rem", color: "var(--text-3)" }}>
              You can update your availability anytime from the{" "}
              <Link to="/dashboard" style={{ color: "var(--teal-dark)", fontWeight: 600 }}>
                Dashboard
              </Link>
              .
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CompleteProfilePage;
