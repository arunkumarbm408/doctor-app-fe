import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const hospitals = [
  ["DocQ Hospital, Sarjapur Road", "Sarjapur Main Road, Bengaluru"],
  ["DocQ Hospital, Hennur Road", "HBR Layout, Hennur Road, Bengaluru"],
  ["DocQ Hospital, RR Nagar", "Ideal Homes Layout, Bengaluru"],
  ["DocQ Women and Children", "Infantry Road, Bengaluru"],
];

const centresOfExcellence = [
  "Orthopaedics & Joint Replacement",
  "Neuroscience & Spine",
  "Urology & Nephrology",
  "Cosmetology & Cosmetic Surgery",
  "General Surgery",
  "Pulmonology",
  "Head & Neck Surgery",
  "Cardiology",
];

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/" },
  { label: "Hospitals", to: "/" },
  { label: "Specialities", to: "/" },
  { label: "Doctors", to: "/doctors" },
  { label: "International Patients", to: "/" },
  { label: "Health Packages", to: "/" },
  { label: "Insurance & TPA List", to: "/" },
  { label: "Doctors By Speciality", to: "/doctors" },
  { label: "Why Choose DocQ", to: "/" },
];

const resources = [
  { label: "Blog", to: "/" },
  { label: "News", to: "/" },
  { label: "BMW Reports", to: "/" },
  { label: "Testimonials", to: "/" },
];

const doctorSpecialities = [
  { label: "Anaesthesiologist", to: "/doctors" },
  { label: "Bariatric Surgeons", to: "/doctors" },
  { label: "Bone Marrow Transplant", to: "/doctors" },
  { label: "Cardiologist", to: "/doctors" },
  { label: "Cosmetologists", to: "/doctors" },
];

const healthPackages = [
  { label: "Advanced Paediatric Package", to: "/" },
  { label: "Well Women Package (55+)", to: "/" },
  { label: "Basic Health Screening", to: "/" },
  { label: "Basic School Paediatric Package", to: "/" },
  { label: "Comprehensive Cardiac Package", to: "/" },
  { label: "Comprehensive Diabetic Check", to: "/" },
];

const topProcedures = [
  "Knee Replacement Surgery",
  "Hip Replacement Surgery",
  "Spine Surgery",
  "Angioplasty",
  "Cataract Surgery",
];

const legalLinks = [
  { label: "Privacy Policy", to: "/" },
  { label: "Disclaimer", to: "/" },
  { label: "Terms and Conditions", to: "/" },
  { label: "CSR Policy", to: "/" },
  { label: "Whistleblower Policy", to: "/" },
];

const socialLinks = [
  { icon: "bi-facebook", href: "#", label: "Facebook" },
  { icon: "bi-twitter-x", href: "#", label: "Twitter / X" },
  { icon: "bi-linkedin", href: "#", label: "LinkedIn" },
  { icon: "bi-instagram", href: "#", label: "Instagram" },
  { icon: "bi-youtube", href: "#", label: "YouTube" },
];

const AppFooter = () => (
  <footer className="footer-shell">
    {/* ── Band 1: Main footer columns ────────────────────────────── */}
    <section className="footer-main-band">
      <Container>
        <div className="footer-main-grid">

          {/* Col 1: Brand */}
          <div className="footer-brand-col">
            <div className="footer-brand-identity">
              <span className="footer-brand-name">DocQ</span>
              <span className="footer-brand-sub">Hospital</span>
            </div>
            <address className="footer-brand-address">
              <p>
                <i className="bi bi-geo-alt-fill" />
                Sarjapur Main Road, Bengaluru – 560 102
              </p>
              <p>
                <i className="bi bi-telephone-fill" />
                <a href="tel:08045309999">080 4530 9999</a>
              </p>
              <p>
                <i className="bi bi-envelope-fill" />
                <a href="mailto:care@doctorbook.com">care@doctorbook.com</a>
              </p>
            </address>
            <div className="footer-social-row">
              {socialLinks.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="footer-social-icon"
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className={`bi ${icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: DocQ HOSPITALS */}
          <div className="footer-nav-col">
            <h6 className="footer-nav-title">DocQ Hospitals</h6>
            <ul className="footer-nav-links">
              {hospitals.map(([name]) => (
                <li key={name}>
                  <Link to="/">
                    <i className="bi bi-chevron-right" />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>

            <h6 className="footer-nav-title" style={{ marginTop: "1.8rem" }}>Centres of Excellence</h6>
            <ul className="footer-nav-links">
              {centresOfExcellence.map((item) => (
                <li key={item}>
                  <Link to="/doctors">
                    <i className="bi bi-chevron-right" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: QUICK LINKS + RESOURCES */}
          <div className="footer-nav-col">
            <h6 className="footer-nav-title">Quick Links</h6>
            <ul className="footer-nav-links">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}>
                    <i className="bi bi-chevron-right" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h6 className="footer-nav-title" style={{ marginTop: "1.8rem" }}>Resources</h6>
            <ul className="footer-nav-links">
              {resources.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}>
                    <i className="bi bi-chevron-right" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: DOCTORS SPECIALITIES + LEGAL */}
          <div className="footer-nav-col">
            <h6 className="footer-nav-title">Doctors Specialities</h6>
            <ul className="footer-nav-links">
              {doctorSpecialities.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}>
                    <i className="bi bi-chevron-right" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h6 className="footer-nav-title" style={{ marginTop: "1.8rem" }}>Health Packages</h6>
            <ul className="footer-nav-links">
              {healthPackages.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}>
                    <i className="bi bi-chevron-right" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: GET IN TOUCH */}
          <div className="footer-nav-col footer-contact-col">
            <h6 className="footer-nav-title">Get In Touch</h6>
            <ul className="footer-nav-links footer-contact-list">
              <li>
                <a href="tel:08045309999">
                  <i className="bi bi-telephone-fill" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="mailto:care@doctorbook.com">
                  <i className="bi bi-envelope-fill" />
                  Enquire Now
                </a>
              </li>
              <li>
                <a href="mailto:care@doctorbook.com">
                  <i className="bi bi-person-check-fill" />
                  Second Opinion
                </a>
              </li>
              <li>
                <a href="mailto:careers@doctorbook.com">
                  <i className="bi bi-briefcase-fill" />
                  Career Opportunities
                </a>
              </li>
            </ul>

            <div className="footer-top-procedures">
              <h6 className="footer-nav-title" style={{ marginTop: "1.5rem" }}>Top Procedures</h6>
              <ul className="footer-nav-links">
                {topProcedures.map((item) => (
                  <li key={item}>
                    <Link to="/doctors">
                      <i className="bi bi-chevron-right" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </Container>
    </section>

    {/* ── Band 3: Copyright bar ───────────────────────────────────── */}
    <div className="footer-bottom-bar">
      <Container>
        <div className="footer-bottom-row">
          <span>
            Copyright &copy; {new Date().getFullYear()} DocQ Hospital,
            A Unit of DocQ Healthcare Pvt Ltd.
          </span>
          <div className="footer-legal-row">
            {legalLinks.map(({ label, to }, i) => (
              <span key={label}>
                <Link to={to}>{label}</Link>
                {i < legalLinks.length - 1 && (
                  <span className="footer-divider">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </div>
  </footer>
);

export default AppFooter;
