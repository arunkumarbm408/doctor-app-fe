import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AppointmentTable from "../components/common/AppointmentTable";
import { fetchMyAppointments, cancelAppointment } from "../features/appointments/appointmentsSlice";
import { fetchDoctorAppointments, updateAppointmentStatus } from "../features/doctors/doctorsSlice";
import { mediaUrl } from "../utils/mediaUrl";

const STATUS_FILTERS = ["All", "Pending", "Approved", "Completed", "Rejected", "Cancelled"];

/* ── Stat card — uses existing .stat-card CSS (navy gradient) ── */
const StatCard = ({ icon, label, value }) => (
  <Card className="border-0 stat-card h-100">
    <Card.Body className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span>{label}</span>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
          }}
        >
          <i className={`bi ${icon}`} />
        </div>
      </div>
      <h3>{value}</h3>
    </Card.Body>
  </Card>
);

/* ── Info row inside the profile card ── */
const InfoRow = ({ icon, label, value }) =>
  value ? (
    <div
      className="d-flex align-items-start gap-2 py-2"
      style={{ borderBottom: "1px solid var(--border-light)", fontSize: "0.875rem" }}
    >
      <i className={`bi ${icon} mt-1 flex-shrink-0`} style={{ color: "var(--teal)", width: 16 }} />
      <div>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-4)", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontWeight: 600, color: "var(--text-2)" }}>{value}</div>
      </div>
    </div>
  ) : null;

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, doctorProfile } = useSelector((s) => s.auth);
  const { appointments } = useSelector((s) => s.appointments);
  const { doctorAppointments } = useSelector((s) => s.doctors);

  const [apptFilter, setApptFilter] = useState("All");
  const [imgError, setImgError] = useState(false);

  /* First-login redirect for approved doctors with no slots */
  useEffect(() => {
    if (
      user?.role === "doctor" &&
      doctorProfile?.isApproved &&
      Array.isArray(doctorProfile.availabilitySlots) &&
      doctorProfile.availabilitySlots.length === 0
    ) {
      navigate("/complete-profile");
    }
  }, [doctorProfile, user, navigate]);

  useEffect(() => {
    if (user?.role === "patient") dispatch(fetchMyAppointments());
    if (user?.role === "doctor") dispatch(fetchDoctorAppointments());
  }, [dispatch, user]);

  const metrics = useMemo(
    () => ({
      total: doctorAppointments.length,
      pending: doctorAppointments.filter((a) => a.status === "Pending").length,
      approved: doctorAppointments.filter((a) => a.status === "Approved").length,
      completed: doctorAppointments.filter((a) => a.status === "Completed").length,
    }),
    [doctorAppointments]
  );

  const filteredAppointments = useMemo(
    () =>
      apptFilter === "All"
        ? doctorAppointments
        : doctorAppointments.filter((a) => a.status === apptFilter),
    [doctorAppointments, apptFilter]
  );

  const handleCancel = (id) => dispatch(cancelAppointment(id));
  const handleStatusChange = (id, status) => dispatch(updateAppointmentStatus({ id, status }));

  /* ── Patient view ─────────────────────────────────────────── */
  if (user?.role === "patient") {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-5">
          <section className="page-hero">
            <span className="eyebrow">
              <i className="bi bi-person-heart" /> Patient dashboard
            </span>
            <h1 className="page-title mt-3">Your consultations</h1>
            <p className="page-subtitle mt-2 mb-0">
              Track booking history, monitor status changes, and manage upcoming appointments.
            </p>
          </section>
          <div
            className="d-flex align-items-center gap-3 p-3 rounded-3"
            style={{ background: "var(--teal-soft)", border: "1.5px solid var(--teal-border)" }}
          >
            <i className="bi bi-person-heart" style={{ fontSize: "1.75rem", color: "var(--teal)" }} />
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--teal-dark)" }}>
                Signed in as patient
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "var(--text)" }}>
                {user?.name}
              </div>
            </div>
          </div>
        </div>
        <Card className="border-0 premium-panel">
          <Card.Body className="p-0">
            <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <h5 className="mb-0" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                <i className="bi bi-calendar2-week me-2" style={{ color: "var(--teal)" }} />
                All appointments
              </h5>
            </div>
            <div className="p-4">
              <AppointmentTable
                appointments={appointments}
                onCancel={handleCancel}
                onPaymentComplete={() => dispatch(fetchMyAppointments())}
              />
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  /* ── Doctor view ──────────────────────────────────────────── */
  const isPending = doctorProfile && !doctorProfile.isApproved;
  const avatarUrl =
    !imgError && doctorProfile?.profileImage
      ? mediaUrl(doctorProfile.profileImage)
      : null;

  return (
    <Container className="py-5">
      {isPending && (
        <Alert
          className="d-flex align-items-start gap-3 mb-4"
          style={{
            background: "var(--warning-bg)",
            border: "1.5px solid var(--warning-border)",
            borderRadius: "var(--r-lg)",
            color: "var(--warning)",
          }}
        >
          <i className="bi bi-hourglass-split flex-shrink-0 mt-1" style={{ fontSize: "1.25rem" }} />
          <div>
            <strong style={{ fontFamily: "'Poppins', sans-serif" }}>Account pending approval</strong>
            <p className="mb-0 mt-1" style={{ fontSize: "0.875rem" }}>
              Your doctor profile is under review. You will receive an email once approved.
            </p>
          </div>
        </Alert>
      )}

      <Row className="g-4">
        {/* ── Left: Profile info card ───────────────────────── */}
        <Col lg={4}>
          <Card
            className="border-0 premium-panel"
            style={{ borderRadius: "var(--r-xl)", overflow: "hidden", position: "sticky", top: 80 }}
          >
            {/* Navy gradient header */}
            <div
              style={{
                background: "linear-gradient(115deg, #075f9a 0%, #8c2964 55%, #c8172f 100%)",
                padding: "28px 24px",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                {/* Avatar */}
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    border: "3px solid rgba(255,255,255,0.25)",
                    flexShrink: 0,
                    background: "rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span style={{ fontSize: "1.7rem", fontWeight: 800, color: "#fff" }}>
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Name + info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5
                    style={{
                      margin: 0,
                      color: "#fff",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Dr. {user?.name}
                  </h5>
                  <p style={{ margin: "3px 0 8px", color: "rgba(255,255,255,0.72)", fontSize: "0.82rem" }}>
                    {doctorProfile?.specialization || "—"}
                    {doctorProfile?.experience ? ` · ${doctorProfile.experience} yrs exp.` : ""}
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 4,
                      background: doctorProfile?.isApproved
                        ? "rgba(134,239,172,0.18)"
                        : "rgba(253,230,138,0.18)",
                      color: doctorProfile?.isApproved ? "#86efac" : "#fde68a",
                      border: `1px solid ${doctorProfile?.isApproved ? "rgba(134,239,172,0.35)" : "rgba(253,230,138,0.35)"}`,
                    }}
                  >
                    {doctorProfile?.isApproved ? "✓ Approved" : "⏳ Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile info body */}
            <Card.Body className="p-4">
              <div className="d-flex flex-column" style={{ gap: 0 }}>
                <InfoRow
                  icon="bi-geo-alt-fill"
                  label="Location"
                  value={doctorProfile?.location}
                />
                <InfoRow
                  icon="bi-currency-rupee"
                  label="Consultation Fee"
                  value={doctorProfile?.fees ? `₹${doctorProfile.fees}` : null}
                />
                <InfoRow
                  icon="bi-award-fill"
                  label="Qualifications"
                  value={doctorProfile?.qualifications?.join(", ") || null}
                />
                <InfoRow
                  icon="bi-calendar-week-fill"
                  label="Available Days"
                  value={
                    doctorProfile?.availabilitySlots?.length
                      ? [
                          ...new Set(doctorProfile.availabilitySlots.map((s) => s.day.slice(0, 3))),
                        ].join(", ")
                      : null
                  }
                />
              </div>

              {doctorProfile?.about && (
                <p
                  className="mt-3 mb-0"
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-3)",
                    lineHeight: 1.7,
                    borderTop: "1px solid var(--border-light)",
                    paddingTop: 12,
                  }}
                >
                  {doctorProfile.about.length > 140
                    ? doctorProfile.about.slice(0, 140) + "…"
                    : doctorProfile.about}
                </p>
              )}

              {/* Action buttons */}
              <div className="d-grid gap-2 mt-4">
                <Button
                  as={Link}
                  to="/profile"
                  className="pill-button btn-teal"
                  style={{ minHeight: 44 }}
                >
                  <i className="bi bi-pencil-square me-2" />
                  View Profile
                </Button>
                <Button
                  as={Link}
                  to="/profile?tab=availability"
                  variant="outline-secondary"
                  className="pill-button"
                  style={{ minHeight: 44, borderColor: "var(--teal-border)", color: "var(--teal-dark)", fontWeight: 600 }}
                >
                  <i className="bi bi-calendar3 me-2" />
                  Manage Availability
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* ── Right: Stats + Appointments ───────────────────── */}
        <Col lg={8}>
          {/* Stat cards */}
          <Row className="g-3 mb-4">
            {[
              { icon: "bi-calendar2-week", label: "Total", value: metrics.total },
              { icon: "bi-hourglass-split", label: "Pending", value: metrics.pending },
              { icon: "bi-check2-circle", label: "Approved", value: metrics.approved },
              { icon: "bi-patch-check", label: "Completed", value: metrics.completed },
            ].map((s) => (
              <Col xs={6} md={3} key={s.label}>
                <StatCard {...s} />
              </Col>
            ))}
          </Row>

          {/* Appointments */}
          <Card className="border-0 premium-panel" style={{ borderRadius: "var(--r-xl)" }}>
            <Card.Body className="p-0">
              <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                  <h5 className="mb-0" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                    <i className="bi bi-calendar-event me-2" style={{ color: "var(--teal)" }} />
                    Appointment requests
                  </h5>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--text-4)",
                      background: "var(--bg-2)",
                      padding: "3px 10px",
                      borderRadius: 4,
                      border: "1px solid var(--border)",
                    }}
                  >
                    {filteredAppointments.length} record{filteredAppointments.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Filter pills */}
                <div className="d-flex gap-2 flex-wrap">
                  {STATUS_FILTERS.map((f) => {
                    const count = f === "All" ? doctorAppointments.length : doctorAppointments.filter((a) => a.status === f).length;
                    const active = apptFilter === f;
                    return (
                      <button
                        key={f}
                        onClick={() => setApptFilter(f)}
                        style={{
                          padding: "4px 13px",
                          borderRadius: 4,
                          border: `1.5px solid ${active ? "var(--teal)" : "var(--border)"}`,
                          background: active ? "var(--teal-soft)" : "transparent",
                          color: active ? "var(--teal-dark)" : "var(--text-3)",
                          fontWeight: active ? 700 : 500,
                          fontSize: "0.78rem",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {f}
                        <span style={{ marginLeft: 4, opacity: 0.65 }}>({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4">
                <AppointmentTable
                  appointments={filteredAppointments}
                  onStatusChange={handleStatusChange}
                  showDoctorActions
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
