import { useEffect } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import StatusBadge from "../components/common/StatusBadge";
import DoctorVerificationPanel from "../components/admin/DoctorVerificationPanel";
import {
  fetchAdminDoctors,
  fetchAdminStats,
  fetchAllAppointments,
  fetchUsers,
  fetchPendingPayments,
  verifyAdminPayment,
} from "../features/admin/adminSlice";

const statCards = (stats) => [
  { icon: "bi-people-fill",          label: "Total users",       value: stats?.users || 0 },
  { icon: "bi-person-badge-fill",    label: "Doctors",           value: stats?.doctors || 0 },
  { icon: "bi-patch-check-fill",     label: "Approved doctors",  value: stats?.approvedDoctors || 0 },
  { icon: "bi-calendar-check-fill",  label: "Appointments",      value: stats?.appointments || 0 },
];

const SectionCard = ({ title, icon, children, className = "" }) => (
  <Card className={`border-0 premium-panel h-100 ${className}`}>
    <Card.Body className="p-0">
      <div
        className="d-flex align-items-center gap-2 p-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <i className={`bi ${icon}`} style={{ color: "var(--teal)", fontSize: "1.1rem" }} />
        <h5
          className="mb-0"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
        >
          {title}
        </h5>
      </div>
      <div className="p-4">{children}</div>
    </Card.Body>
  </Card>
);

const AdminPage = () => {
  const dispatch = useDispatch();
  const { stats, users, doctors, appointments, payments } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchUsers());
    dispatch(fetchAdminDoctors());
    dispatch(fetchAllAppointments());
    dispatch(fetchPendingPayments());
  }, [dispatch]);

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-5">
        <section className="page-hero">
          <span className="eyebrow">
            <i className="bi bi-gear-fill" />
            Admin control center
          </span>
          <h1 className="page-title mt-3">Platform overview</h1>
          <p className="page-subtitle mt-2 mb-0">
            Oversee doctors, users, and appointments with full operational visibility.
          </p>
        </section>
        <div
          className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
          style={{
            background: "var(--warning-bg)",
            border: "1px solid var(--warning-border)",
            fontSize: "0.8rem",
            color: "var(--warning)",
            fontWeight: 700,
          }}
        >
          <i className="bi bi-shield-fill-exclamation" />
          Admin access
        </div>
      </div>

      {/* Stats */}
      <Row className="g-3 mb-5">
        {statCards(stats).map(({ icon, label, value }) => (
          <Col md={6} lg={3} key={label}>
            <Card
              className="border-0 h-100 hospital-stat-card"
              style={{ borderRadius: "var(--r-lg)" }}
            >
              <Card.Body className="p-4" style={{ color: "white" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.65)",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {label}
                  </span>
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: 38,
                      height: 38,
                      background: "rgba(255,255,255,0.12)",
                      fontSize: "1.1rem",
                    }}
                  >
                    <i className={`bi ${icon}`} />
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "2.25rem",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {value}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Doctor Verification Panel */}
      <SectionCard title="Doctor Verification" icon="bi-patch-check" className="mb-4">
        <DoctorVerificationPanel doctors={doctors} />
      </SectionCard>

      {/* Users */}
      <Row className="g-4 mb-4">
        <Col xl={12}>
          <SectionCard title="Users" icon="bi-people">
            <div className="appointments-table-wrap">
              <Table hover className="appointments-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {!users.length && (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-muted" style={{ fontSize: "0.875rem" }}>
                        No users registered yet.
                      </td>
                    </tr>
                  )}
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>{u.email}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={
                            u.role === "doctor"
                              ? { background: "var(--teal-soft)", color: "var(--teal-dark)", borderColor: "var(--teal-border)" }
                              : u.role === "admin"
                              ? { background: "var(--warning-bg)", color: "var(--warning)", borderColor: "var(--warning-border)" }
                              : { background: "var(--neutral-bg)", color: "var(--neutral-text)", borderColor: "var(--neutral-border)" }
                          }
                        >
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </SectionCard>
        </Col>
      </Row>

      {/* All appointments */}
      <SectionCard title="All appointments" icon="bi-calendar2-week">
        <div className="appointments-table-wrap">
          <Table hover className="appointments-table align-middle mb-0">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Slot</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!appointments.length && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted" style={{ fontSize: "0.875rem" }}>
                    No appointments yet.
                  </td>
                </tr>
              )}
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td style={{ fontWeight: 600 }}>{appt.patient?.name}</td>
                  <td style={{ color: "var(--text-2)", fontWeight: 500 }}>{appt.doctor?.user?.name}</td>
                  <td style={{ color: "var(--text-3)" }}>{appt.appointmentDate}</td>
                  <td style={{ color: "var(--text-3)" }}>{appt.timeSlot}</td>
                  <td><StatusBadge value={appt.status} /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </SectionCard>

      {/* Pending Payments */}
      <div className="mt-5">
        <SectionCard title="Pending Payments Verification" icon="bi-credit-card">
          <div className="appointments-table-wrap">
            <Table hover className="appointments-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Amount</th>
                  <th>UTR ID</th>
                  <th>Screenshot</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {!payments.length && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted" style={{ fontSize: "0.875rem" }}>
                      No pending payments to verify.
                    </td>
                  </tr>
                )}
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 600 }}>{p.patient?.name}</td>
                    <td style={{ color: "var(--text-3)" }}>₹{p.amount}</td>
                    <td style={{ color: "var(--text-3)" }}>{p.utrId}</td>
                    <td>
                      {p.screenshot ? (
                        <a href={`${import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:5001"}${p.screenshot}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary pill-button">
                          <i className="bi bi-eye"></i> View
                        </a>
                      ) : (
                        <span className="text-muted small">No screenshot</span>
                      )}
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="success"
                        className="pill-button me-2"
                        onClick={() => dispatch(verifyAdminPayment({ id: p._id, isApproved: true }))}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        className="pill-button"
                        onClick={() => dispatch(verifyAdminPayment({ id: p._id, isApproved: false }))}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </SectionCard>
      </div>

    </Container>
  );
};

export default AdminPage;
