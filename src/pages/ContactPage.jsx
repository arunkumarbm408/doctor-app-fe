import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      {/* ── Hero banner ───────────────────────────────────────────── */}
      <div className="contact-hero">
        <Container>
          <p className="contact-hero-sub">Get In Touch</p>
          <h1 className="contact-hero-title">We're Here to Help</h1>
          <p className="contact-hero-desc">
            Have questions about booking an appointment, our services, or
            partnerships? Reach out to us and our team will get back to you
            within 24 hours.
          </p>
        </Container>
      </div>

      {/* ── Info cards ────────────────────────────────────────────── */}
      <section className="contact-info-band">
        <Container>
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <i className="bi bi-geo-alt-fill" />
              </div>
              <h6>Our Office</h6>
              <p>INITWAVE Solutions Pvt Ltd</p>
              <p>Bengaluru, Karnataka – 560 001</p>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <i className="bi bi-telephone-fill" />
              </div>
              <h6>Call Us</h6>
              <a href="tel:08045309999">080 4530 9999</a>
              <a href="tel:08045309998">080 4530 9998</a>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <i className="bi bi-envelope-fill" />
              </div>
              <h6>Email Us</h6>
              <a href="mailto:support@docqueue.in">support@docqueue.in</a>
              <a href="mailto:hello@initwave.in">hello@initwave.in</a>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <i className="bi bi-clock-fill" />
              </div>
              <h6>Working Hours</h6>
              <p>Mon – Sat: 9:00 AM – 6:00 PM</p>
              <p>Support: 24 × 7</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Form + About ──────────────────────────────────────────── */}
      <section className="contact-main-band">
        <Container>
          <Row className="g-5 align-items-start">
            {/* Form */}
            <Col lg={7}>
              <div className="contact-form-card">
                <h2 className="contact-form-title">Send Us a Message</h2>
                <p className="contact-form-sub">
                  Fill in the details below and our team will contact you
                  shortly.
                </p>

                {submitted ? (
                  <div className="contact-success">
                    <i className="bi bi-check-circle-fill" />
                    <h5>Message Sent Successfully!</h5>
                    <p>
                      Thank you for reaching out. We'll get back to you within
                      24 hours.
                    </p>
                    <button
                      className="contact-reset-btn"
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit} className="contact-form">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Full Name <span>*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Email Address <span>*</span></Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Subject <span>*</span></Form.Label>
                          <Form.Select
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select a subject</option>
                            <option>Appointment Booking Help</option>
                            <option>Doctor Registration</option>
                            <option>Technical Support</option>
                            <option>Partnership / Business</option>
                            <option>Feedback</option>
                            <option>Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Message <span>*</span></Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={5}
                            name="message"
                            placeholder="Write your message here..."
                            value={form.message}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <button type="submit" className="contact-submit-btn">
                          <i className="bi bi-send-fill" />
                          Send Message
                        </button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </div>
            </Col>

            {/* About INITWAVE */}
            <Col lg={5}>
              <div className="contact-about-card">
                <div className="contact-about-logo">
                  <span className="initwave-logo">INITWAVE</span>
                  <span className="initwave-tagline">Solutions Pvt Ltd</span>
                </div>
                <p className="contact-about-desc">
                  DocQ is proudly built and maintained by{" "}
                  <strong>INITWAVE Solutions</strong>, a technology company
                  focused on building smart, accessible healthcare platforms
                  across India.
                </p>
                <div className="contact-about-points">
                  <div>
                    <i className="bi bi-check-circle-fill" />
                    <span>HIPAA-compliant secure platform</span>
                  </div>
                  <div>
                    <i className="bi bi-check-circle-fill" />
                    <span>Real-time appointment management</span>
                  </div>
                  <div>
                    <i className="bi bi-check-circle-fill" />
                    <span>500+ verified doctors onboarded</span>
                  </div>
                  <div>
                    <i className="bi bi-check-circle-fill" />
                    <span>Multi-hospital, multi-speciality support</span>
                  </div>
                  <div>
                    <i className="bi bi-check-circle-fill" />
                    <span>24x7 patient support desk</span>
                  </div>
                </div>
                <div className="contact-social">
                  <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin" /></a>
                  <a href="#" aria-label="Twitter"><i className="bi bi-twitter-x" /></a>
                  <a href="#" aria-label="Instagram"><i className="bi bi-instagram" /></a>
                  <a href="#" aria-label="Facebook"><i className="bi bi-facebook" /></a>
                </div>
                <div className="contact-built-by">
                  <i className="bi bi-code-slash" />
                  Built with care by INITWAVE Solutions
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ContactPage;
