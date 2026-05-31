import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const HOSPITALS = {
  "sarjapur-road": {
    id: "sarjapur-road",
    name: "DocQ Hospital, Sarjapur Road",
    address: "Sarjapur Main Road, Bengaluru – 560035",
    phone: "+91 80 4530 9901",
    email: "sarjapur@docqueue.in",
    timing: "Mon – Sat: 8:00 AM – 8:00 PM",
    emergency: "24 × 7 Emergency",
    about:
      "DocQ Hospital, Sarjapur Road is a multi-specialty tertiary care hospital serving the rapidly growing IT corridor of Bengaluru. Equipped with cutting-edge diagnostic technology and experienced medical professionals, the hospital delivers comprehensive healthcare to patients across South-East Bengaluru.",
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
    specialities: [
      { icon: "bi-heart-pulse-fill",    name: "Cardiology",          desc: "Advanced cardiac care & interventional procedures" },
      { icon: "bi-activity",            name: "Orthopaedics",        desc: "Joint replacement, spine & sports medicine" },
      { icon: "bi-lungs-fill",          name: "Pulmonology",         desc: "Respiratory medicine & critical care" },
      { icon: "bi-gender-female",       name: "Gynaecology",         desc: "Women's health, obstetrics & fertility" },
      { icon: "bi-person-hearts",       name: "Paediatrics",         desc: "Child health from neonatal to adolescence" },
      { icon: "bi-brain",               name: "Neurology",           desc: "Stroke, epilepsy & movement disorders" },
      { icon: "bi-droplet-fill",        name: "Nephrology",          desc: "Kidney disease management & dialysis" },
      { icon: "bi-eye-fill",            name: "Ophthalmology",       desc: "Cataract, retina & refractive surgery" },
    ],
    stats: [
      { value: "250+", label: "Beds" },
      { value: "80+",  label: "Doctors" },
      { value: "12+",  label: "Departments" },
      { value: "24/7", label: "Emergency" },
    ],
  },
  "hennur-road": {
    id: "hennur-road",
    name: "DocQ Hospital, Hennur Road",
    address: "HBR Layout, Hennur Road, Bengaluru – 560043",
    phone: "+91 80 4530 9902",
    email: "hennur@docqueue.in",
    timing: "Mon – Sat: 8:00 AM – 8:00 PM",
    emergency: "24 × 7 Emergency",
    about:
      "Located in the heart of North Bengaluru's fastest-growing residential zone, DocQ Hospital, Hennur Road offers world-class multi-specialty care with a strong focus on preventive health and community wellness programmes.",
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80",
    specialities: [
      { icon: "bi-heart-pulse-fill",    name: "Cardiology",          desc: "Preventive cardiology & interventional care" },
      { icon: "bi-activity",            name: "Orthopaedics",        desc: "Fracture care, joint replacement & rehab" },
      { icon: "bi-gender-female",       name: "Gynaecology",         desc: "Antenatal, postnatal & women's wellness" },
      { icon: "bi-person-hearts",       name: "Paediatrics",         desc: "Vaccinations, growth monitoring & child care" },
      { icon: "bi-capsule-pill",        name: "General Medicine",    desc: "Internal medicine & chronic disease management" },
      { icon: "bi-bandaid-fill",        name: "General Surgery",     desc: "Laparoscopic & minimally invasive surgeries" },
      { icon: "bi-ear-fill",            name: "ENT",                 desc: "Ear, nose & throat disorders" },
      { icon: "bi-tooth",               name: "Dental",              desc: "Oral health, implants & cosmetic dentistry" },
    ],
    stats: [
      { value: "180+", label: "Beds" },
      { value: "60+",  label: "Doctors" },
      { value: "10+",  label: "Departments" },
      { value: "24/7", label: "Emergency" },
    ],
  },
  "rr-nagar": {
    id: "rr-nagar",
    name: "DocQ Hospital, RR Nagar",
    address: "Ideal Homes Layout, RR Nagar, Bengaluru – 560098",
    phone: "+91 80 4530 9903",
    email: "rrnagar@docqueue.in",
    timing: "Mon – Sat: 8:00 AM – 8:00 PM",
    emergency: "24 × 7 Emergency",
    about:
      "DocQ Hospital, RR Nagar serves the densely populated West Bengaluru community with comprehensive multi-specialty healthcare. The hospital is known for its Centre of Excellence in Oncology and state-of-the-art surgical suites.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    specialities: [
      { icon: "bi-radioactive",         name: "Oncology",            desc: "Cancer diagnosis, chemotherapy & radiation" },
      { icon: "bi-heart-pulse-fill",    name: "Cardiology",          desc: "Cardiac surgery & electrophysiology" },
      { icon: "bi-activity",            name: "Orthopaedics",        desc: "Complex fractures & reconstructive surgery" },
      { icon: "bi-brain",               name: "Neurosurgery",        desc: "Brain tumours, spine & peripheral nerves" },
      { icon: "bi-droplet-fill",        name: "Urology",             desc: "Kidney stones, prostate & laparoscopic urology" },
      { icon: "bi-lungs-fill",          name: "Pulmonology",         desc: "COPD, asthma & sleep disorders" },
      { icon: "bi-capsule-pill",        name: "Gastroenterology",    desc: "Endoscopy, liver & digestive disorders" },
      { icon: "bi-bandaid-fill",        name: "Plastic Surgery",     desc: "Reconstructive & cosmetic procedures" },
    ],
    stats: [
      { value: "300+", label: "Beds" },
      { value: "100+", label: "Doctors" },
      { value: "15+",  label: "Departments" },
      { value: "24/7", label: "Emergency" },
    ],
  },
  "women-children": {
    id: "women-children",
    name: "DocQ Women and Children",
    address: "Infantry Road, Bengaluru – 560001",
    phone: "+91 80 4530 9904",
    email: "womenchildren@docqueue.in",
    timing: "Mon – Sat: 8:00 AM – 8:00 PM",
    emergency: "24 × 7 Emergency",
    about:
      "DocQ Women and Children is a dedicated super-specialty hospital focused entirely on women's health and paediatric care. From high-risk pregnancies to neonatal intensive care and adolescent medicine, we provide compassionate, expert-driven healthcare for every stage of life.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    specialities: [
      { icon: "bi-gender-female",       name: "Obstetrics",          desc: "Normal & high-risk deliveries, antenatal care" },
      { icon: "bi-gender-female",       name: "Gynaecology",         desc: "PCOS, endometriosis & minimally invasive surgery" },
      { icon: "bi-person-hearts",       name: "Neonatology",         desc: "NICU care for premature & sick newborns" },
      { icon: "bi-person-hearts",       name: "Paediatrics",         desc: "Comprehensive child health from birth to 18 yrs" },
      { icon: "bi-heart-fill",          name: "Fertility",           desc: "IVF, IUI & assisted reproductive technology" },
      { icon: "bi-brain",               name: "Paediatric Neurology",desc: "Developmental delays, epilepsy & autism" },
      { icon: "bi-activity",            name: "Paed. Orthopaedics",  desc: "Congenital & developmental bone disorders" },
      { icon: "bi-bandaid-fill",        name: "Paed. Surgery",       desc: "Neonatal & general paediatric surgery" },
    ],
    stats: [
      { value: "150+", label: "Beds" },
      { value: "50+",  label: "Doctors" },
      { value: "8+",   label: "Departments" },
      { value: "24/7", label: "Emergency" },
    ],
  },
};

const ALL_HOSPITALS = Object.values(HOSPITALS);

const HospitalPage = () => {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const hospital = HOSPITALS[hospitalId];

  if (!hospital) {
    return (
      <div className="hp-not-found">
        <Container className="text-center py-5">
          <i className="bi bi-hospital" style={{ fontSize: "3rem", color: "#c5d9ef" }} />
          <h4 className="mt-3">Hospital not found</h4>
          <Link to="/doctors" className="btn btn-primary mt-3">Browse Doctors</Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="hp-page">
      {/* ── Hero ── */}
      <div className="hp-hero" style={{ backgroundImage: `url(${hospital.image})` }}>
        <div className="hp-hero-overlay" />
        <Container className="hp-hero-content">
          <p className="hp-breadcrumb">
            <Link to="/">Home</Link>
            <i className="bi bi-chevron-right" />
            <span>Hospitals</span>
            <i className="bi bi-chevron-right" />
            <span>{hospital.name}</span>
          </p>
          <h1 className="hp-hero-title">{hospital.name}</h1>
          <p className="hp-hero-address">
            <i className="bi bi-geo-alt-fill" /> {hospital.address}
          </p>
          <div className="hp-hero-badges">
            <span><i className="bi bi-clock-fill" /> {hospital.timing}</span>
            <span className="hp-badge-emergency"><i className="bi bi-plus-circle-fill" /> {hospital.emergency}</span>
          </div>
        </Container>
      </div>

      {/* ── Stats bar ── */}
      <div className="hp-stats-bar">
        <Container>
          <div className="hp-stats-grid">
            {hospital.stats.map((s) => (
              <div key={s.label} className="hp-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container className="hp-body">
        <Row className="g-4">
          {/* ── Left: about + specialities ── */}
          <Col lg={8}>
            {/* About */}
            <div className="hp-section-card">
              <h2 className="hp-section-title">
                <i className="bi bi-info-circle-fill" /> About the Hospital
              </h2>
              <p className="hp-about-text">{hospital.about}</p>
            </div>

            {/* Specialities */}
            <div className="hp-section-card mt-4">
              <h2 className="hp-section-title">
                <i className="bi bi-grid-fill" /> Departments & Specialities
              </h2>
              <div className="hp-spec-grid">
                {hospital.specialities.map((s) => (
                  <div key={s.name} className="hp-spec-card">
                    <div className="hp-spec-icon">
                      <i className={`bi ${s.icon}`} />
                    </div>
                    <div>
                      <p className="hp-spec-name">{s.name}</p>
                      <p className="hp-spec-desc">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* ── Right: contact + CTA + other hospitals ── */}
          <Col lg={4}>
            {/* Contact card */}
            <div className="hp-section-card hp-contact-card">
              <h3 className="hp-section-title">
                <i className="bi bi-telephone-fill" /> Contact
              </h3>
              <ul className="hp-contact-list">
                <li>
                  <i className="bi bi-geo-alt-fill" />
                  <span>{hospital.address}</span>
                </li>
                <li>
                  <i className="bi bi-telephone-fill" />
                  <a href={`tel:${hospital.phone}`}>{hospital.phone}</a>
                </li>
                <li>
                  <i className="bi bi-envelope-fill" />
                  <a href={`mailto:${hospital.email}`}>{hospital.email}</a>
                </li>
                <li>
                  <i className="bi bi-clock-fill" />
                  <span>{hospital.timing}</span>
                </li>
              </ul>
              <Link
                to={`/doctors?location=${encodeURIComponent(hospital.address.split(",")[0])}`}
                className="hp-cta-btn"
              >
                <i className="bi bi-search" /> Find Doctors Here
              </Link>
              <Link to="/booking" className="hp-cta-btn hp-cta-btn--outline mt-2">
                <i className="bi bi-calendar2-plus" /> Book Appointment
              </Link>
            </div>

            {/* Other hospitals */}
            <div className="hp-section-card mt-4">
              <h3 className="hp-section-title">
                <i className="bi bi-hospital-fill" /> Other Hospitals
              </h3>
              <div className="hp-other-list">
                {ALL_HOSPITALS.filter((h) => h.id !== hospital.id).map((h) => (
                  <Link key={h.id} to={`/hospitals/${h.id}`} className="hp-other-item">
                    <i className="bi bi-chevron-right" />
                    <span>{h.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HospitalPage;
