import { useState } from "react";
import { Alert, Badge, Button, Form, Modal, Tab, Tabs } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toggleDoctorApproval, requestDoctorInfo } from "../../features/admin/adminSlice";
import { mediaUrl } from "../../utils/mediaUrl";

const getVerificationStatus = (doc) =>
  doc.verificationStatus || (doc.isApproved ? "Approved" : "Pending");

const statusVariant = (s) => {
  if (s === "Approved") return "success";
  if (s === "Rejected") return "danger";
  if (s === "Info Requested") return "warning";
  return "secondary";
};

const Field = ({ label, value }) =>
  value !== undefined && value !== null && value !== "" ? (
    <div className="mb-3">
      <div
        style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "var(--text-3)",
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div style={{ fontWeight: 500, color: "var(--text)", fontSize: "0.9rem" }}>{value}</div>
    </div>
  ) : null;

const cloudinaryDownloadUrl = (url, filename) => {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;

  const safeFilename = (filename || "doctor-document").replace(/\.[^/.]+$/, "");
  return url.replace("/upload/", `/upload/fl_attachment:${encodeURIComponent(safeFilename)}/`);
};

const DocRow = ({ label, url, filename, isImage }) => (
  <div
    className="d-flex align-items-center gap-3 p-3 rounded-3"
    style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "var(--r-md)",
        background: isImage ? "var(--teal-soft)" : "var(--neutral-bg, #f1f5f9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <i
        className={`bi ${isImage ? "bi-image" : "bi-file-earmark-text"}`}
        style={{ color: isImage ? "var(--teal)" : "var(--text-3)", fontSize: "1.15rem" }}
      />
    </div>
    <div className="flex-grow-1" style={{ minWidth: 0 }}>
      <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{label}</div>
      <div style={{ fontSize: "0.72rem", color: "var(--text-3)", wordBreak: "break-all" }}>
        {filename}
      </div>
    </div>
    <div className="d-flex gap-2 flex-shrink-0">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="btn btn-sm btn-outline-secondary pill-button"
        style={{ fontSize: "0.78rem" }}
      >
        <i className="bi bi-eye me-1" />Preview
      </a>
      <a
        href={cloudinaryDownloadUrl(url, filename)}
        download={filename}
        className="btn btn-sm pill-button btn-teal"
        style={{ fontSize: "0.78rem" }}
      >
        <i className="bi bi-download me-1" />Download
      </a>
    </div>
  </div>
);

const DoctorDetailModal = ({ doctor, onHide, onUpdate }) => {
  const dispatch = useDispatch();
  const [actionMode, setActionMode] = useState(null); // null | "reject" | "requestInfo"
  const [actionNote, setActionNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const status = getVerificationStatus(doctor);
  const docs = doctor.documents || [];
  const history = [...(doctor.verificationHistory || [])].reverse();
  const emailLog = [...(doctor.emailLog || [])].reverse();

  const resetAction = () => {
    setActionMode(null);
    setActionNote("");
    setErr("");
  };

  const handleApprove = async () => {
    setBusy(true);
    setErr("");
    const result = await dispatch(toggleDoctorApproval({ id: doctor._id, isApproved: true }));
    if (result.error) {
      setErr(result.payload || "Failed to approve doctor");
    } else {
      onUpdate(result.payload);
    }
    setBusy(false);
  };

  const handleReject = async () => {
    setBusy(true);
    setErr("");
    const result = await dispatch(
      toggleDoctorApproval({ id: doctor._id, isApproved: false, rejectionReason: actionNote })
    );
    if (result.error) {
      setErr(result.payload || "Failed to reject doctor");
      setBusy(false);
      return;
    }
    onUpdate(result.payload);
    resetAction();
    setBusy(false);
  };

  const handleRequestInfo = async () => {
    if (!actionNote.trim()) {
      setErr("Please describe what information is needed.");
      return;
    }
    setBusy(true);
    setErr("");
    const result = await dispatch(requestDoctorInfo({ id: doctor._id, message: actionNote }));
    if (result.error) {
      setErr(result.payload || "Failed to send request");
      setBusy(false);
      return;
    }
    onUpdate(result.payload);
    resetAction();
    setBusy(false);
  };

  return (
    <Modal show onHide={onHide} size="lg" centered scrollable>
      {/* ── Header ── */}
      <Modal.Header closeButton style={{ borderBottom: "1px solid var(--border)", padding: "1rem 1.5rem" }}>
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "var(--r-md)",
              background: "var(--teal-soft)",
              border: "1.5px solid var(--teal-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {doctor.profileImage ? (
              <img
                src={mediaUrl(doctor.profileImage)}
                alt={doctor.user?.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <i className="bi bi-person-badge" style={{ color: "var(--teal)", fontSize: "1.4rem" }} />
            )}
          </div>
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1rem" }}>
              {doctor.user?.name}
            </div>
            <div className="d-flex align-items-center gap-2 mt-1">
              <Badge bg={statusVariant(status)} style={{ fontSize: "0.7rem" }}>
                {status}
              </Badge>
              <span style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>
                {doctor.specialization}
              </span>
            </div>
          </div>
        </div>
      </Modal.Header>

      {/* ── Body with tabs ── */}
      <Modal.Body className="p-0">
        <Tabs defaultActiveKey="profile" className="px-4 pt-3" style={{ borderBottom: "1px solid var(--border)" }}>

          {/* Profile tab */}
          <Tab eventKey="profile" title={<><i className="bi bi-person-vcard me-1" />Profile</>}>
            <div className="p-4">
              <div className="row g-0">
                <div className="col-md-6 pe-md-4">
                  <Field label="Full Name" value={doctor.user?.name} />
                  <Field label="Email Address" value={doctor.user?.email} />
                  <Field label="Phone Number" value={doctor.user?.phone} />
                  <Field label="License / Reg. No." value={doctor.licenseNumber} />
                  <Field label="Specialization" value={doctor.specialization} />
                  <Field
                    label="Experience"
                    value={doctor.experience !== undefined ? `${doctor.experience} years` : null}
                  />
                </div>
                <div
                  className="col-md-6 ps-md-4"
                  style={{ borderLeft: "1px solid var(--border)" }}
                >
                  <Field
                    label="Qualifications"
                    value={
                      Array.isArray(doctor.qualifications)
                        ? doctor.qualifications.join(", ")
                        : doctor.qualifications
                    }
                  />
                  <Field
                    label="Consultation Fees"
                    value={doctor.fees !== undefined ? `₹${doctor.fees}` : null}
                  />
                  <Field label="Clinic / Hospital" value={doctor.clinicName} />
                  <Field label="Address / City" value={doctor.location} />
                  <Field
                    label="Account Status"
                    value={doctor.user?.isActive ? "Active" : "Inactive"}
                  />
                  <Field
                    label="Registration Date"
                    value={new Date(doctor.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  />
                </div>
              </div>

              {doctor.about && (
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                  <Field label="About / Bio" value={doctor.about} />
                </div>
              )}

              {doctor.rejectionReason && (
                <Alert
                  variant="danger"
                  className="mt-3 py-2"
                  style={{ borderRadius: "var(--r-md)", fontSize: "0.875rem" }}
                >
                  <i className="bi bi-x-circle me-2" />
                  <strong>Rejection reason:</strong> {doctor.rejectionReason}
                </Alert>
              )}
            </div>
          </Tab>

          {/* Documents tab */}
          <Tab
            eventKey="documents"
            title={
              <>
                <i className="bi bi-file-earmark-text me-1" />
                Documents ({docs.length + (doctor.profileImage ? 1 : 0)})
              </>
            }
          >
            <div className="p-4">
              {!doctor.profileImage && docs.length === 0 ? (
                <p className="text-muted text-center py-5" style={{ fontSize: "0.875rem" }}>
                  <i className="bi bi-file-earmark-x d-block mb-2" style={{ fontSize: "2rem" }} />
                  No documents uploaded.
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {doctor.profileImage && (
                    <DocRow
                      label="Profile Photo"
                      url={mediaUrl(doctor.profileImage)}
                      filename={doctor.profileImage.split("/").pop()}
                      isImage
                    />
                  )}
                  {docs.map((d, i) => {
                    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(d);
                    return (
                      <DocRow
                        key={i}
                        label={`Document ${i + 1}`}
                        url={mediaUrl(d)}
                        filename={d.split("/").pop() || `document-${i + 1}`}
                        isImage={isImage}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </Tab>

          {/* Emails tab */}
          <Tab
            eventKey="emails"
            title={<><i className="bi bi-envelope me-1" />Emails ({emailLog.length})</>}
          >
            <div className="p-4">
              {emailLog.length === 0 ? (
                <p className="text-muted text-center py-5" style={{ fontSize: "0.875rem" }}>
                  <i className="bi bi-envelope-x d-block mb-2" style={{ fontSize: "2rem" }} />
                  No emails sent yet.
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {emailLog.map((entry, i) => {
                    const labelMap = {
                      applicationReceived: "Application Received",
                      approved: "Account Approved",
                      rejected: "Application Rejected",
                      infoRequested: "Info Requested",
                    };
                    return (
                      <div
                        key={i}
                        className="d-flex align-items-start gap-3 p-3 rounded-3"
                        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "var(--r-md)",
                            background:
                              entry.status === "sent"
                                ? "rgba(16,185,129,0.1)"
                                : "rgba(239,68,68,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <i
                            className={`bi ${entry.status === "sent" ? "bi-envelope-check-fill" : "bi-envelope-x-fill"}`}
                            style={{ color: entry.status === "sent" ? "var(--teal)" : "#ef4444" }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)" }}>
                              {labelMap[entry.type] || entry.type}
                            </span>
                            <span
                              className="badge rounded-pill"
                              style={{
                                background: entry.status === "sent" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                                color: entry.status === "sent" ? "var(--teal)" : "#ef4444",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                              }}
                            >
                              {entry.status === "sent" ? "Delivered" : "Failed"}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: 3 }}>
                            {new Date(entry.sentAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </div>
                          {entry.messageId && (
                            <div
                              style={{
                                fontSize: "0.68rem",
                                color: "var(--text-3)",
                                fontFamily: "monospace",
                                marginTop: 2,
                                wordBreak: "break-all",
                              }}
                            >
                              ID: {entry.messageId}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Tab>

          {/* Verification log tab */}
          <Tab
            eventKey="log"
            title={<><i className="bi bi-clock-history me-1" />Log ({history.length})</>}
          >
            <div className="p-4">
              {history.length === 0 ? (
                <p className="text-muted text-center py-5" style={{ fontSize: "0.875rem" }}>
                  <i className="bi bi-journal-x d-block mb-2" style={{ fontSize: "2rem" }} />
                  No verification actions recorded yet.
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {history.map((entry, i) => (
                    <div
                      key={i}
                      className="d-flex gap-3 align-items-start p-3 rounded-3"
                      style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "var(--r-md)",
                          background:
                            entry.action === "Approved"
                              ? "rgba(16,185,129,0.1)"
                              : entry.action === "Rejected"
                              ? "rgba(239,68,68,0.1)"
                              : "rgba(245,158,11,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <i
                          className={`bi ${
                            entry.action === "Approved"
                              ? "bi-check-circle-fill"
                              : entry.action === "Rejected"
                              ? "bi-x-circle-fill"
                              : "bi-question-circle-fill"
                          }`}
                          style={{
                            color:
                              entry.action === "Approved"
                                ? "var(--teal)"
                                : entry.action === "Rejected"
                                ? "#ef4444"
                                : "#f59e0b",
                          }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <Badge bg={statusVariant(entry.action)} style={{ fontSize: "0.7rem" }}>
                            {entry.action}
                          </Badge>
                          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-2)" }}>
                            by {entry.byName || "Admin"}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                            {new Date(entry.at).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                        {entry.note && (
                          <p
                            className="mb-0 mt-1"
                            style={{ fontSize: "0.83rem", color: "var(--text-3)", lineHeight: 1.5 }}
                          >
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>

      {/* ── Footer with action area ── */}
      <Modal.Footer
        style={{
          borderTop: "1px solid var(--border)",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "0.75rem",
          padding: "1rem 1.5rem",
        }}
      >
        {err && (
          <Alert
            variant="danger"
            className="py-2 mb-0"
            style={{ borderRadius: "var(--r-md)", fontSize: "0.875rem" }}
          >
            <i className="bi bi-exclamation-triangle me-2" />
            {err}
          </Alert>
        )}

        {actionMode === "reject" && (
          <div>
            <Form.Label className="form-label-soft">
              Rejection reason{" "}
              <span style={{ fontWeight: 400, color: "var(--text-3)" }}>(optional — will be emailed)</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              className="form-control-soft"
              placeholder="e.g. License number could not be verified, please resubmit documents…"
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {actionMode === "requestInfo" && (
          <div>
            <Form.Label className="form-label-soft">
              Information requested{" "}
              <span style={{ fontWeight: 400, color: "var(--text-3)" }}>(will be emailed to doctor)</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              className="form-control-soft"
              placeholder="Describe what additional documents or clarifications are needed…"
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              autoFocus
            />
          </div>
        )}

        <div className="d-flex gap-2 justify-content-between align-items-center">
          <Button variant="outline-secondary" size="sm" className="pill-button" onClick={onHide}>
            Close
          </Button>

          <div className="d-flex gap-2">
            {actionMode === "requestInfo" ? (
              <>
                <Button size="sm" variant="outline-secondary" className="pill-button" onClick={resetAction}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="warning"
                  className="pill-button"
                  onClick={handleRequestInfo}
                  disabled={busy}
                >
                  {busy ? (
                    <span className="spinner-border spinner-border-sm me-1" />
                  ) : (
                    <i className="bi bi-send me-1" />
                  )}
                  Send request
                </Button>
              </>
            ) : actionMode === "reject" ? (
              <>
                <Button size="sm" variant="outline-secondary" className="pill-button" onClick={resetAction}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  className="pill-button"
                  onClick={handleReject}
                  disabled={busy}
                >
                  {busy ? (
                    <span className="spinner-border spinner-border-sm me-1" />
                  ) : (
                    <i className="bi bi-x-circle me-1" />
                  )}
                  Confirm rejection
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline-warning"
                  className="pill-button"
                  onClick={() => { setActionMode("requestInfo"); setActionNote(""); setErr(""); }}
                >
                  <i className="bi bi-question-circle me-1" />Request info
                </Button>
                {status !== "Rejected" && (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="pill-button"
                    onClick={() => { setActionMode("reject"); setActionNote(""); setErr(""); }}
                  >
                    <i className="bi bi-x-circle me-1" />Reject
                  </Button>
                )}
                {status !== "Approved" && (
                  <Button
                    size="sm"
                    className="pill-button btn-teal"
                    onClick={handleApprove}
                    disabled={busy}
                  >
                    {busy ? (
                      <span className="spinner-border spinner-border-sm me-1" />
                    ) : (
                      <i className="bi bi-check-circle me-1" />
                    )}
                    Approve
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DoctorDetailModal;
