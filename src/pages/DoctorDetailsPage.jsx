import { useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchDoctorDetails } from "../features/doctors/doctorsSlice";
import { currency } from "../utils/formatters";
import StatusBadge from "../components/common/StatusBadge";
import { mediaUrl } from "../utils/mediaUrl";

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { doctor, bookedSlots } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchDoctorDetails(id));
  }, [dispatch, id]);

  if (!doctor) {
    return (
      <Container className="py-5">
        <div className="d-flex align-items-center gap-3 text-muted py-5">
          <span className="spinner-border spinner-border-sm" role="status" />
          Loading doctor profile…
        </div>
      </Container>
    );
  }

  const imageUrl = mediaUrl(
    doctor.profileImage,
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80"
  );

  const quickInfo = [
    { icon: "bi-award-fill",         label: "Experience",       value: `${doctor.experience} years` },
    { icon: "bi-currency-rupee",     label: "Consultation fee", value: currency(doctor.fees) },
    { icon: "bi-geo-alt-fill",       label: "Location",         value: doctor.location },
    { icon: "bi-mortarboard-fill",   label: "Qualifications",   value: doctor.qualifications?.join(", ") || "Not added" },
  ];

  return (
    <Container className="py-5">
      <section className="page-hero mb-5">
        <Link
          to="/doctors"
          className="d-inline-flex align-items-center gap-1 mb-3"
          style={{ fontSize: "0.875rem", color: "var(--teal)", fontWeight: 600 }}
        >
          <i className="bi bi-chevron-left" />
          Back to all doctors
        </Link>
        <span className="eyebrow">
          <i className="bi bi-person-badge" />
          Doctor profile
        </span>
        <h1 className="page-title mt-3">{doctor.user?.name}</h1>
        <p className="page-subtitle mt-2 mb-0">
          Review credentials, availability, current booking activity, and consultation details.
        </p>
      </section>

      <Row className="g-4">
        {/* Left column */}
        <Col lg={4}>
          <Card className="border-0 premium-panel overflow-hidden mb-3">
            <img src={imageUrl} alt={doctor.user?.name} className="detail-image" />
          </Card>

          <Card className="border-0 premium-panel">
            <Card.Body className="p-4">
              <p className="mini-label mb-3">Quick info</p>
              <div className="d-grid gap-3">
                {quickInfo.map(({ icon, label, value }) => (
                  <div key={label} className="d-flex gap-3 align-items-start">
                    <div
                      className="icon-circle flex-shrink-0"
                      style={{ width: 36, height: 36, fontSize: "0.95rem" }}
                    >
                      <i className={`bi ${icon}`} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "var(--text-3)",
                          marginBottom: "0.15rem",
                        }}
                      >
                        {label}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-2)" }}>
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right column */}
        <Col lg={8}>
          <Card className="border-0 premium-panel detail-card">
            <Card.Body className="p-4 p-lg-5">
              {/* Header */}
              <div className="d-flex justify-content-between flex-wrap gap-3 mb-4">
                <div>
                  <h2 className="mb-1">{doctor.user?.name}</h2>
                  <p className="text-muted mb-0">{doctor.specialization}</p>
                </div>
                <StatusBadge value={doctor.isApproved ? "Available" : "Reviewing"} />
              </div>

              {/* About */}
              <p className="detail-copy mb-4">
                {doctor.about ||
                  "This specialist profile will show care philosophy, treatment approach, and consultation guidance once the doctor completes their profile."}
              </p>

              <hr style={{ borderColor: "var(--border)", marginBottom: "1.5rem" }} />

              {/* Availability */}
              <div className="mb-4">
                <h6 className="section-mini-title">
                  <i className="bi bi-clock-fill me-2" style={{ color: "var(--teal)" }} />
                  Availability slots
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {doctor.availabilitySlots?.length ? (
                    doctor.availabilitySlots.map((slot, i) => (
                      <span key={`${slot.day}-${i}`} className="slot-chip">
                        <i className="bi bi-calendar3" />
                        {slot.day}: {slot.startTime} – {slot.endTime}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted" style={{ fontSize: "0.875rem" }}>
                      No availability slots added yet.
                    </span>
                  )}
                </div>
              </div>

              {/* Booked slots */}
              <div className="mb-5">
                <h6 className="section-mini-title">
                  <i className="bi bi-calendar-check-fill me-2" style={{ color: "var(--teal)" }} />
                  Current booking activity
                </h6>
                {bookedSlots?.slice(0, 5).length ? (
                  <div className="booked-list">
                    {bookedSlots.slice(0, 5).map((item) => (
                      <div key={item._id} className="booked-row">
                        <span>
                          <i className="bi bi-calendar3 me-2" style={{ color: "var(--text-3)" }} />
                          {item.appointmentDate}
                        </span>
                        <strong style={{ color: "var(--text)" }}>{item.timeSlot}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
                    No active bookings visible yet.
                  </p>
                )}
              </div>

              <Button
                as={Link}
                to={`/booking/${doctor._id}`}
                size="lg"
                className="pill-button btn-teal"
              >
                <i className="bi bi-calendar-plus me-2" />
                Book Appointment
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorDetailsPage;
