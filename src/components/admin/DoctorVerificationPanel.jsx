import { useMemo, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import StatusBadge from "../common/StatusBadge";
import DoctorDetailModal from "./DoctorDetailModal";
import { toggleDoctorApproval } from "../../features/admin/adminSlice";
import { mediaUrl } from "../../utils/mediaUrl";

const STATUS_TABS = ["All", "Pending", "Approved", "Rejected", "Info Requested"];

const getVerificationStatus = (doc) =>
  doc.verificationStatus || (doc.isApproved ? "Approved" : "Pending");

const DoctorVerificationPanel = ({ doctors }) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const counts = useMemo(
    () =>
      STATUS_TABS.reduce((acc, s) => {
        acc[s] =
          s === "All"
            ? doctors.length
            : doctors.filter((d) => getVerificationStatus(d) === s).length;
        return acc;
      }, {}),
    [doctors]
  );

  const filtered =
    filter === "All" ? doctors : doctors.filter((d) => getVerificationStatus(d) === filter);

  const handleQuickApprove = (e, docId) => {
    e.stopPropagation();
    dispatch(toggleDoctorApproval({ id: docId, isApproved: true }));
  };

  return (
    <>
      {/* Status filter tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm pill-button ${filter === s ? "btn-teal" : "btn-outline-secondary"}`}
            style={{ fontWeight: 600, fontSize: "0.8rem" }}
          >
            {s}
            <span
              className="ms-2 badge rounded-pill"
              style={{
                background: filter === s ? "rgba(255,255,255,0.25)" : "var(--teal-soft)",
                color: "var(--teal-dark)",
                fontSize: "0.68rem",
              }}
            >
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-5" style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>
          <i className="bi bi-person-badge d-block mb-2" style={{ fontSize: "2.5rem", opacity: 0.35 }} />
          No doctors in this category.
        </div>
      ) : (
        <Row className="g-3">
          {filtered.map((doc) => {
            const status = getVerificationStatus(doc);
            return (
              <Col md={6} xl={4} key={doc._id}>
                <Card
                  className="border-0 h-100"
                  style={{
                    borderRadius: "var(--r-lg)",
                    border: "1px solid var(--border)",
                    background: "var(--bg-2)",
                    transition: "box-shadow 0.15s",
                  }}
                >
                  <Card.Body className="p-3 d-flex flex-column">
                    <div className="d-flex align-items-start gap-3 flex-grow-1">
                      {/* Avatar */}
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: "var(--r-md)",
                          background: "var(--teal-soft)",
                          border: "1.5px solid var(--teal-border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        {doc.profileImage ? (
                          <img
                            src={mediaUrl(doc.profileImage)}
                            alt={doc.user?.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <i
                            className="bi bi-person-badge"
                            style={{ color: "var(--teal)", fontSize: "1.5rem" }}
                          />
                        )}
                      </div>

                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-start justify-content-between gap-1">
                          <strong
                            className="text-truncate d-block"
                            style={{
                              fontSize: "0.9rem",
                              fontFamily: "'Poppins', sans-serif",
                              maxWidth: "70%",
                            }}
                          >
                            {doc.user?.name}
                          </strong>
                          <StatusBadge value={status} />
                        </div>

                        <div style={{ fontSize: "0.78rem", color: "var(--teal-dark)", fontWeight: 600, marginTop: 2 }}>
                          {doc.specialization}
                        </div>

                        <div style={{ fontSize: "0.73rem", color: "var(--text-3)", marginTop: 4, lineHeight: 1.8 }}>
                          <div>
                            <i className="bi bi-envelope me-1" />
                            {doc.user?.email}
                          </div>
                          {doc.user?.phone && (
                            <div>
                              <i className="bi bi-telephone me-1" />
                              {doc.user.phone}
                            </div>
                          )}
                          <div>
                            <i className="bi bi-calendar3 me-1" />
                            {new Date(doc.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          {doc.clinicName && (
                            <div>
                              <i className="bi bi-hospital me-1" />
                              {doc.clinicName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card actions */}
                    <div className="d-flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="pill-button flex-grow-1"
                        style={{ fontSize: "0.78rem" }}
                        onClick={() => setSelected(doc)}
                      >
                        <i className="bi bi-eye me-1" />View details
                      </Button>
                      {status === "Pending" || status === "Info Requested" ? (
                        <Button
                          size="sm"
                          className="pill-button btn-teal"
                          style={{ fontSize: "0.78rem" }}
                          onClick={(e) => handleQuickApprove(e, doc._id)}
                        >
                          <i className="bi bi-check-circle me-1" />Approve
                        </Button>
                      ) : null}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {selected && (
        <DoctorDetailModal
          doctor={selected}
          onHide={() => setSelected(null)}
          onUpdate={(updated) => setSelected(updated)}
        />
      )}
    </>
  );
};

export default DoctorVerificationPanel;
