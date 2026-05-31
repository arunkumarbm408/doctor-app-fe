import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchMyDoctorProfile } from "../features/doctors/doctorsSlice";
import WeeklySchedule from "../components/doctor/WeeklySchedule";
import { mediaUrl } from "../utils/mediaUrl";

const DetailRow = ({ icon, label, value }) => (
  <div
    className="d-flex align-items-start gap-3 py-3"
    style={{ borderBottom: "1px solid var(--border-light)" }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "var(--r-md)",
        background: "var(--teal-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <i className={`bi ${icon}`} style={{ color: "var(--teal-dark)", fontSize: "0.95rem" }} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p className="mb-1" style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </p>
      <p className="mb-0" style={{ fontSize: "0.92rem", fontWeight: 600, color: value ? "var(--text-1)" : "var(--text-3)" }}>
        {value || "—"}
      </p>
    </div>
  </div>
);

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { user, doctorProfile } = useSelector((s) => s.auth);
  const { loading: profileLoading, error } = useSelector((s) => s.doctors);

  const initialTab = searchParams.get("tab") === "availability" ? "availability" : "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (user?.role === "doctor") {
      dispatch(fetchMyDoctorProfile());
    }
  }, [dispatch, user?.role]);

  const avatarUrl =
    !imgError && doctorProfile?.profileImage
      ? mediaUrl(doctorProfile.profileImage)
      : null;

  const tabStyle = (tab) => ({
    padding: "10px 22px",
    borderRadius: 4,
    border: "none",
    background: activeTab === tab ? "var(--primary)" : "transparent",
    color: activeTab === tab ? "#fff" : "var(--text-3)",
    fontWeight: 700,
    fontSize: "0.875rem",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    transition: "all 0.15s",
  });

  return (
    <Container className="py-5">
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-5">
        <section className="page-hero">
          <span className="eyebrow">
            <i className="bi bi-person-vcard" /> My Profile
          </span>
          <h1 className="page-title mt-3">Dr. {user?.name}</h1>
          <p className="page-subtitle mt-2 mb-0">
            View your professional details and manage weekly availability.
          </p>
        </section>

        <div
          className="d-flex align-items-center gap-2 p-1"
          style={{ background: "var(--bg-2)", borderRadius: 4, border: "1px solid var(--border)" }}
        >
          <button style={tabStyle("profile")} onClick={() => setActiveTab("profile")}>
            <i className="bi bi-person-lines-fill me-2" />Profile
          </button>
          <button style={tabStyle("availability")} onClick={() => setActiveTab("availability")}>
            <i className="bi bi-calendar3 me-2" />Availability
          </button>
        </div>
      </div>

      {activeTab === "profile" && (
        <Row className="g-4">
          <Col lg={3}>
            <Card className="border-0 premium-panel text-center" style={{ borderRadius: "var(--r-xl)", overflow: "hidden", position: "sticky", top: 80 }}>
              <div style={{ background: "linear-gradient(115deg, #075f9a 0%, #8c2964 55%, #c8172f 100%)", padding: "28px 24px 20px" }}>
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    border: "3px solid rgba(255,255,255,0.3)",
                    margin: "0 auto 12px",
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
                    <span style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <Card.Body className="p-4">
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1rem", margin: "0 0 4px" }}>
                  Dr. {user?.name}
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-3)", margin: "0 0 12px" }}>
                  {doctorProfile?.specialization || "—"}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: 4,
                    background: doctorProfile?.isApproved ? "var(--success-bg)" : "var(--warning-bg)",
                    color: doctorProfile?.isApproved ? "var(--success)" : "var(--warning)",
                    border: `1px solid ${doctorProfile?.isApproved ? "var(--success-border)" : "var(--warning-border)"}`,
                  }}
                >
                  {doctorProfile?.isApproved ? "✓ Approved" : "⏳ Pending Approval"}
                </span>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            <Card className="border-0 premium-panel" style={{ borderRadius: "var(--r-xl)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(115deg, #075f9a 0%, #8c2964 55%, #c8172f 100%)", padding: "22px 28px" }}>
                <h5 style={{ margin: 0, color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                  <i className="bi bi-briefcase me-2" />Professional Details
                </h5>
                <p style={{ margin: "5px 0 0", color: "rgba(255,255,255,0.65)", fontSize: "0.85rem" }}>
                  Information from your registered profile. Contact admin to request changes.
                </p>
              </div>

              <Card.Body className="p-4">
                {profileLoading && !doctorProfile && (
                  <div className="d-flex align-items-center gap-2 text-muted py-4">
                    <span className="spinner-border spinner-border-sm" role="status" />
                    Loading profile…
                  </div>
                )}

                {error && (
                  <div
                    className="d-flex align-items-center gap-2 p-3 mb-4 rounded-3"
                    style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-border)", color: "var(--danger)", fontSize: "0.875rem" }}
                  >
                    <i className="bi bi-exclamation-triangle-fill" />
                    {error}
                  </div>
                )}

                {doctorProfile && (
                  <>
                    <DetailRow icon="bi-heart-pulse-fill" label="Specialization" value={doctorProfile.specialization} />
                    <DetailRow
                      icon="bi-clock-history"
                      label="Experience"
                      value={doctorProfile.experience != null ? `${doctorProfile.experience} years` : null}
                    />
                    <DetailRow
                      icon="bi-currency-rupee"
                      label="Consultation Fee"
                      value={doctorProfile.fees != null ? `₹${doctorProfile.fees}` : null}
                    />
                    <DetailRow icon="bi-geo-alt-fill" label="Location / Clinic" value={doctorProfile.location} />
                    <DetailRow
                      icon="bi-award-fill"
                      label="Qualifications"
                      value={doctorProfile.qualifications?.length ? doctorProfile.qualifications.join(", ") : null}
                    />

                    {doctorProfile.about && (
                      <div className="pt-3">
                        <p className="mb-1" style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          About
                        </p>
                        <p className="mb-0" style={{ fontSize: "0.92rem", color: "var(--text-2)", lineHeight: 1.7 }}>
                          {doctorProfile.about}
                        </p>
                      </div>
                    )}

                    {doctorProfile.documents?.length > 0 && (
                      <div className="pt-4 mt-2" style={{ borderTop: "1px solid var(--border-light)" }}>
                        <p className="mb-2" style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          Certificates
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                          {doctorProfile.documents.map((doc, index) => (
                            <a
                              key={doc}
                              href={mediaUrl(doc)}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm pill-button"
                              style={{ borderColor: "var(--teal-border)", color: "var(--teal-dark)", fontWeight: 600 }}
                            >
                              <i className="bi bi-file-earmark-text me-1" />
                              Certificate {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {activeTab === "availability" && (
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="border-0 premium-panel" style={{ borderRadius: "var(--r-xl)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(115deg, #075f9a 0%, #8c2964 55%, #c8172f 100%)", padding: "22px 28px" }}>
                <h5 style={{ margin: 0, color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                  <i className="bi bi-calendar3 me-2" />Weekly Availability
                </h5>
                <p style={{ margin: "5px 0 0", color: "rgba(255,255,255,0.65)", fontSize: "0.85rem" }}>
                  Set the days and time slots when patients can book appointments.
                </p>
              </div>
              <Card.Body className="p-4">
                <WeeklySchedule existingSlots={doctorProfile?.availabilitySlots || []} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProfilePage;
