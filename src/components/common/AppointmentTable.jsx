import { Table, Button } from "react-bootstrap";
import StatusBadge from "./StatusBadge";
import RazorpayPayButton from "./RazorpayPayButton";

const AppointmentTable = ({ appointments, onCancel, onStatusChange, showDoctorActions = false, onPaymentComplete }) => (
  <div className="appointments-table-wrap">
    <Table hover className="appointments-table align-middle mb-0">
      <thead>
        <tr>
          <th>{showDoctorActions ? "Patient" : "Doctor"}</th>
          <th>Date</th>
          <th>Slot</th>
          <th>Status</th>
          <th>Payment</th>
          <th className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {!appointments.length && (
          <tr>
            <td colSpan={6} className="text-center py-5" style={{ color: "var(--text-3)" }}>
              <i
                className="bi bi-calendar2-x d-block mb-2"
                style={{ fontSize: "2rem", color: "var(--teal-border)" }}
              />
              No appointments to show yet.
            </td>
          </tr>
        )}
        {appointments.map((appt) => (
          <tr key={appt._id}>
            <td>
              <div className="table-person">
                <strong>
                  {showDoctorActions
                    ? appt.patient?.name
                    : appt.doctor?.user?.name || "Doctor"}
                </strong>
                <span>
                  {showDoctorActions
                    ? appt.patient?.email
                    : appt.doctor?.user?.email}
                </span>
              </div>
            </td>
            <td>
              <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                <i className="bi bi-calendar3 me-1" style={{ color: "var(--teal)" }} />
                {appt.appointmentDate}
              </span>
            </td>
            <td>
              <span style={{ fontSize: "0.875rem" }}>
                <i className="bi bi-clock me-1" style={{ color: "var(--teal)" }} />
                {appt.timeSlot}
              </span>
            </td>
            <td><StatusBadge value={appt.status} /></td>
            <td>
              <StatusBadge value={appt.paymentStatus} />
              {appt.paymentStatus === "Pending" && appt.paymentMethod === "PhonePe" && (
                <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                  Waiting for verification
                </div>
              )}
              {appt.paymentStatus === "Pending" && appt.paymentMethod === "Razorpay" && !showDoctorActions && (
                <div className="mt-2">
                  <RazorpayPayButton
                    appointment={appt}
                    doctorName={appt.doctor?.user?.name}
                    onPaid={onPaymentComplete}
                  />
                </div>
              )}
              {appt.paymentStatus === "Pending" && appt.paymentMethod === "Razorpay" && showDoctorActions && (
                <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                  Awaiting Razorpay payment
                </div>
              )}
            </td>
            <td>
              <div className="d-flex gap-2 flex-wrap justify-content-end">
                {onCancel &&
                  appt.status !== "Cancelled" &&
                  appt.status !== "Completed" && (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="pill-button"
                      onClick={() => onCancel(appt._id)}
                    >
                      <i className="bi bi-x-circle me-1" />
                      Cancel
                    </Button>
                  )}
                {onStatusChange && appt.status === "Pending" && (
                  <div className="d-flex align-items-center justify-content-end w-100 gap-2 mb-2">
                    {appt.paymentMethod !== "Pay at clinic" && appt.paymentStatus === "Pending" && (
                      <span className="text-muted small" style={{ fontStyle: "italic", whiteSpace: "nowrap" }}>
                        {appt.paymentMethod === "Razorpay"
                          ? "Awaiting Razorpay payment"
                          : "Waiting payment verification"}
                      </span>
                    )}
                    <Button
                      size="sm"
                      className="pill-button btn-teal"
                      disabled={appt.paymentMethod !== "Pay at clinic" && appt.paymentStatus === "Pending"}
                      onClick={() => onStatusChange(appt._id, "Approved")}
                    >
                      <i className="bi bi-check-circle me-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="pill-button"
                      onClick={() => onStatusChange(appt._id, "Rejected")}
                    >
                      <i className="bi bi-x-circle me-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

export default AppointmentTable;
