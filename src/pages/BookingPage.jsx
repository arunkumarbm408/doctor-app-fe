import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  bookAppointment,
  createRazorpayOrder,
  submitPayment,
  verifyRazorpayPayment,
} from "../features/appointments/appointmentsSlice";
import { fetchDoctorDetails } from "../features/doctors/doctorsSlice";
import { loadRazorpayScript, openRazorpayCheckout } from "../utils/razorpayCheckout";
import { currency } from "../utils/formatters";

const suggestedSlots = ["10:00 - 10:30", "10:30 - 11:00", "11:00 - 11:30", "11:30 - 12:00"];

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { doctor, bookedSlots } = useSelector((state) => state.doctors);
  const { bookingLoading, error } = useSelector((state) => state.appointments);
  const [paymentError, setPaymentError] = useState("");
  const [form, setForm] = useState({
    appointmentDate: "",
    timeSlot: "",
    symptoms: "",
    paymentMethod: "Pay at clinic",
    utrId: "",
    screenshot: null,
  });

  useEffect(() => {
    dispatch(fetchDoctorDetails(id));
  }, [dispatch, id]);

  const blockedSlots = useMemo(
    () =>
      bookedSlots
        ?.filter((s) => s.appointmentDate === form.appointmentDate)
        .map((s) => s.timeSlot) || [],
    [bookedSlots, form.appointmentDate]
  );

  const processRazorpayPayment = async (appointmentId) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) throw new Error("Could not load Razorpay. Check your connection.");

    const orderResult = await dispatch(createRazorpayOrder(appointmentId));
    if (orderResult.error) throw new Error(orderResult.payload || "Failed to create payment order");

    const order = orderResult.payload;
    const keyId = order.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!keyId) throw new Error("Razorpay key is not configured");

    const paymentResponse = await openRazorpayCheckout({
      keyId,
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      doctorName: doctor?.user?.name || order.doctorName,
      user,
    });

    const verifyResult = await dispatch(
      verifyRazorpayPayment({
        appointmentId,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      })
    );

    if (verifyResult.error) throw new Error(verifyResult.payload || "Payment verification failed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");

    const { screenshot, utrId, paymentMethod, ...bookingPayload } = form;
    const result = await dispatch(bookAppointment({ doctorId: id, ...bookingPayload, paymentMethod }));

    if (result.error || !result.payload?._id) return;

    const appointmentId = result.payload._id;

    try {
      if (paymentMethod === "Razorpay") {
        await processRazorpayPayment(appointmentId);
        navigate("/dashboard");
        return;
      }

      if (paymentMethod === "PhonePe") {
        const formData = new FormData();
        formData.append("appointmentId", appointmentId);
        formData.append("utrId", utrId);
        if (screenshot) formData.append("screenshot", screenshot);
        const paymentResult = await dispatch(submitPayment(formData));
        if (!paymentResult.error) navigate("/dashboard");
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      if (err.message !== "Payment cancelled") {
        setPaymentError(
          `${err.message || "Payment failed"}. Your appointment was booked — complete payment from your dashboard.`
        );
      } else {
        setPaymentError("Payment cancelled. You can pay anytime from your dashboard.");
      }
    }
  };

  const steps = [
    { icon: "bi-calendar3", label: "Select date & time", done: !!form.appointmentDate && !!form.timeSlot },
    { icon: "bi-chat-text", label: "Describe symptoms", done: !!form.symptoms },
    { icon: "bi-credit-card", label: "Choose payment", done: true },
  ];

  return (
    <Container className="py-5">
      <section className="page-hero mb-5">
        <span className="eyebrow">
          <i className="bi bi-shield-lock" />
          Secure booking
        </span>
        <h1 className="page-title mt-3">Confirm your consultation</h1>
        <p className="page-subtitle mt-2 mb-0">
          Choose a date, review open time slots, and complete your booking details with confidence.
        </p>
      </section>

      <Row className="g-4 align-items-start">
        <Col lg={4}>
          <Card className="border-0 premium-panel booking-side-panel">
            <Card.Body className="p-4">
              <p className="mini-label mb-3">Selected doctor</p>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="icon-circle" style={{ width: 50, height: 50, fontSize: "1.3rem" }}>
                  <i className="bi bi-person-badge" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>
                    {doctor?.user?.name || "Loading…"}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-3)" }}>{doctor?.specialization || "—"}</div>
                </div>
              </div>

              <div className="booking-side-meta">
                <div>
                  <span>Location</span>
                  <strong>{doctor?.location || "—"}</strong>
                </div>
                <div>
                  <span>Consultation fee</span>
                  <strong>{doctor?.fees ? currency(doctor.fees) : "—"}</strong>
                </div>
                <div>
                  <span>Slots already booked</span>
                  <strong>{bookedSlots?.length || 0}</strong>
                </div>
                <div>
                  <span>Payment mode</span>
                  <strong>{form.paymentMethod}</strong>
                </div>
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="mini-label mb-3">Booking steps</p>
                {steps.map(({ icon, label, done }, i) => (
                  <div key={i} className="d-flex align-items-center gap-2 mb-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: 28,
                        height: 28,
                        background: done ? "var(--teal-soft)" : "var(--bg)",
                        border: `1.5px solid ${done ? "var(--teal)" : "var(--border)"}`,
                        fontSize: "0.75rem",
                        color: done ? "var(--teal)" : "var(--text-4)",
                      }}
                    >
                      <i className={done ? "bi bi-check2" : `bi ${icon}`} />
                    </div>
                    <span style={{ fontSize: "0.82rem", color: done ? "var(--text-2)" : "var(--text-3)", fontWeight: done ? 600 : 400 }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 premium-panel">
            <Card.Body className="p-4 p-lg-5">
              <h2 className="mb-1">Book appointment</h2>
              <p className="text-muted mb-4" style={{ fontSize: "0.875rem" }}>
                {doctor ? `Consultation with ${doctor.user?.name}` : "Loading doctor details…"}
              </p>

              {error && (
                <Alert variant="danger" className="d-flex align-items-center gap-2 py-2 mb-4" style={{ borderRadius: "var(--r-md)" }}>
                  <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
                  {error}
                </Alert>
              )}

              {paymentError && (
                <Alert variant="warning" className="d-flex align-items-center gap-2 py-2 mb-4" style={{ borderRadius: "var(--r-md)" }}>
                  <i className="bi bi-info-circle-fill flex-shrink-0" />
                  {paymentError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <p className="mini-label mb-3">Schedule</p>
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Label className="form-label-soft">
                      <i className="bi bi-calendar3 me-1" />
                      Appointment date
                    </Form.Label>
                    <Form.Control
                      className="form-control-soft"
                      type="date"
                      value={form.appointmentDate}
                      onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label-soft">
                      <i className="bi bi-clock me-1" />
                      Time slot
                    </Form.Label>
                    <Form.Select
                      className="form-control-soft"
                      value={form.timeSlot}
                      onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                      required
                    >
                      <option value="">Choose a slot</option>
                      {suggestedSlots.map((slot) => (
                        <option key={slot} value={slot} disabled={blockedSlots.includes(slot)}>
                          {slot} {blockedSlots.includes(slot) ? "— Booked" : ""}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>

                <hr style={{ borderColor: "var(--border)", marginBottom: "1.25rem" }} />
                <p className="mini-label mb-3">Consultation details</p>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label-soft">
                    <i className="bi bi-chat-text me-1" />
                    Symptoms / reason for visit
                  </Form.Label>
                  <Form.Control
                    className="form-control-soft"
                    as="textarea"
                    rows={4}
                    placeholder="Briefly describe your symptoms or the reason for this consultation…"
                    value={form.symptoms}
                    onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label-soft">
                    <i className="bi bi-credit-card me-1" />
                    Payment method
                  </Form.Label>
                  <Form.Select
                    className="form-control-soft"
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  >
                    <option>Pay at clinic</option>
                    <option>Razorpay</option>
                    <option>PhonePe</option>
                  </Form.Select>
                </Form.Group>

                {form.paymentMethod === "Razorpay" && (
                  <div
                    className="p-3 mb-4 rounded-3"
                    style={{ background: "var(--teal-soft)", border: "1px solid var(--teal-border)" }}
                  >
                    <p className="fw-bold mb-2">
                      <i className="bi bi-shield-check me-2" />
                      Pay securely with Razorpay
                    </p>
                    <p className="small text-muted mb-0">
                      After confirming your booking, the Razorpay checkout will open for{" "}
                      <strong>{doctor?.fees ? currency(doctor.fees) : "the consultation fee"}</strong>.
                      Payment is verified instantly — no manual approval needed.
                    </p>
                  </div>
                )}

                {form.paymentMethod === "PhonePe" && (
                  <div className="p-3 mb-4 rounded-3" style={{ background: "var(--neutral-bg)", border: "1px solid var(--border)" }}>
                    <p className="fw-bold mb-2">Pay via PhonePe QR</p>
                    <p className="small text-muted mb-3">
                      Scan the QR code below and transfer the amount. Then provide the UTR ID and a screenshot of the successful payment.
                    </p>
                    <div className="text-center mb-3">
                      <img src="https://via.placeholder.com/150?text=PhonePe+QR" alt="QR Code" style={{ borderRadius: 8 }} />
                    </div>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-soft">UTR ID</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        type="text"
                        placeholder="Enter 12-digit UTR ID"
                        value={form.utrId}
                        onChange={(e) => setForm({ ...form, utrId: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-soft">Payment Screenshot</Form.Label>
                      <Form.Control
                        className="form-control-soft"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setForm({ ...form, screenshot: e.target.files[0] })}
                        required
                      />
                    </Form.Group>
                  </div>
                )}

                <Button type="submit" size="lg" className="pill-button btn-teal w-100" disabled={bookingLoading}>
                  {bookingLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      {form.paymentMethod === "Razorpay" ? "Booking & opening payment…" : "Confirming booking…"}
                    </>
                  ) : (
                    <>
                      <i className={`bi ${form.paymentMethod === "Razorpay" ? "bi-credit-card" : "bi-calendar-check"} me-2`} />
                      {form.paymentMethod === "Razorpay" ? "Book & Pay with Razorpay" : "Confirm Appointment"}
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;
