import { useEffect } from "react";
import { Button, Card, Carousel, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchDoctors } from "../features/doctors/doctorsSlice";
import { mediaUrl } from "../utils/mediaUrl";

const specialities = [
  ["https://www.sparshhospital.com/wp-content/uploads/2023/07/anesthesiology-icon.png", "Anaesthesiology"],
  ["https://www.sparshhospital.com/wp-content/uploads/2023/06/sample-cardiology-icon.png", "Cardiac Sciences"],
  ["https://www.sparshhospital.com/wp-content/uploads/2023/07/critical-care-emergency-services-icon.png", "Critical Care Medicine"],
  ["https://www.sparshhospital.com/wp-content/uploads/2023/07/dermatology-main.png", "Dermatology"],
  ["https://www.sparshhospital.com/wp-content/uploads/2023/07/emergency-medicine.png", "Emergency Medicine"],
  ["https://www.sparshhospital.com/wp-content/uploads/2023/07/dentistry-inner-icon.png", "Dentistry"],
  ["https://www.sparshhospital.com/wp-content/uploads/2023/07/dentistry-main-icon.png", "Department of Maxillofacial and Dental Surgery"],
  ["https://www.sparshhospital.com/wp-content/uploads/2023/07/bone-marrow-icon.png", "Bone Marrow Transplant"],
  ["https://www.sparshhospital.com/wp-content/uploads/2023/07/bariatric-weighing.png", "Bariatric Sciences"],
  ["https://www.sparshhospital.com/wp-content/uploads/2023/07/diabetics-icon.png", "Endocrinology and Diabetology"],
  ["https://www.sparshhospital.com/wp-content/uploads/2023/07/ent-icon.png", "ENT"],
  ["https://www.sparshhospital.com/wp-content/uploads/2023/07/family-medicine.png", "Family Medicine"],
];

const hospitals = [
  [
    "DocQ Hospital, Infantry Road",
    "Opp Police Commissioner's office, No 146, Infantry Road, Bengaluru",
    "https://www.sparshhospital.com/wp-content/uploads/2023/07/sparsh-hospital-infantry-road-thumbnail.jpeg",
  ],
  [
    "DocQ Hospital, Hennur Road",
    "HBR Layout, Hennur Road, Bengaluru",
    "https://www.sparshhospital.com/wp-content/uploads/2025/04/SPARSH-Hospital-Hennur-Road-Hospital-thumbnail.jpg",
  ],
  [
    "DocQ Hospital, Sarjapur Road",
    "Sarjapur Main Road, Bengaluru",
    "https://www.sparshhospital.com/wp-content/uploads/2025/06/sarjapur-hospital-image-resized.webp",
  ],
];

const facilities = [
  ["bi-calendar2-check", "Instant Online Appointment Booking"],
  ["bi-camera-video", "Video & In-Person Consultations"],
  ["bi-person-check", "Verified Doctor Profiles"],
  ["bi-shield-check", "Secure Patient Records"],
  ["bi-headset", "24x7 Patient Care Support"],
  ["bi-bell", "Appointment Reminders & Alerts"],
  ["bi-search-heart", "Multi-Speciality Doctor Search"],
  ["bi-receipt", "Digital Prescriptions & Reports"],
];


const heroSlides = [
  {
    image: "https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1600&h=560&fit=crop",
    alt: "Doctor consulting with patient at desk",
    badge: "Your Health, Our Priority",
    headline: "Quality Care,\nEvery Step of the Way",
    sub: "Book appointments with trusted doctors and get expert consultations.",
    cta: { label: "Book Appointment", to: "/appointments/book" },
  },
  {
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&crop=center&w=1600&h=560&q=85",
    alt: "Doctor with patient",
    badge: "Verified Specialists",
    headline: "Expert Doctors,\nTrusted Care",
    sub: "Choose from hundreds of verified specialists across all major departments.",
    cta: { label: "Find a Doctor", to: "/doctors" },
  },
  {
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&crop=center&w=1600&h=560&q=85",
    alt: "Medical professional",
    badge: "Advanced Treatment",
    headline: "Your Health,\nOur Commitment",
    sub: "World-class facilities and compassionate professionals, all in one place.",
    cta: { label: "Explore Specialities", to: "/doctors" },
  },
  {
    image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1600&h=560&fit=crop",
    alt: "Modern hospital facility",
    badge: "Multi-Speciality Hospitals",
    headline: "Premium Care,\nNear You",
    sub: "4 hospitals across Bengaluru — 200+ specialists and 24×7 emergency care.",
    cta: { label: "Our Hospitals", to: "/doctors" },
  },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchDoctors({ limit: 8 }));
  }, [dispatch]);

  return (
    <>
      <section className="sparsh-hero">
        <Carousel
          className="sparsh-hero-carousel"
          interval={3500}
          controls
          indicators
          fade
          pause={false}
        >
          {heroSlides.map((slide) => (
            <Carousel.Item key={slide.image}>
              <div className="hero-slide-wrap">
                <img src={slide.image} alt={slide.alt} className="sparsh-hero-banner" />
                <div className="hero-slide-overlay">
                  <div className="hero-slide-badge">
                    <i className="bi bi-shield-heart-fill me-2" />
                    {slide.badge}
                  </div>
                  <h1 className="hero-slide-title">
                    {slide.headline.split("\n").map((line, i) => (
                      <span key={i}>{line}{i === 0 && <br />}</span>
                    ))}
                  </h1>
                  <p className="hero-slide-sub">{slide.sub}</p>
                  <Link to={slide.cta.to} className="hero-slide-cta">
                    {slide.cta.label}
                    <i className="bi bi-arrow-right ms-2" />
                  </Link>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      <section className="appointment-search-band">
        <Container>
          <div className="appointment-search-panel">
            <Form>
              <Row className="g-2 align-items-center">
                <Col md={6} lg={3}>
                  <div className="search-select-wrap">
                    <i className="bi bi-hospital search-select-icon" />
                    <Form.Select className="form-control-soft search-select-input">
                      <option>Select Hospital</option>
                      {hospitals.map(([name]) => (
                        <option key={name}>{name}</option>
                      ))}
                    </Form.Select>
                    <i className="bi bi-chevron-down search-select-arrow" />
                  </div>
                </Col>
                <Col md={6} lg={3}>
                  <div className="search-select-wrap">
                    <i className="bi bi-grid search-select-icon" />
                    <Form.Select className="form-control-soft search-select-input">
                      <option>Select Speciality</option>
                      {specialities.map(([, title]) => (
                        <option key={title}>{title}</option>
                      ))}
                    </Form.Select>
                    <i className="bi bi-chevron-down search-select-arrow" />
                  </div>
                </Col>
                <Col md={6} lg={3}>
                  <div className="search-select-wrap">
                    <i className="bi bi-activity search-select-icon" />
                    <Form.Select className="form-control-soft search-select-input">
                      <option>Select Subspeciality</option>
                      <option>Consultation</option>
                      <option>Diagnostics</option>
                      <option>Follow-up</option>
                    </Form.Select>
                    <i className="bi bi-chevron-down search-select-arrow" />
                  </div>
                </Col>
                <Col md={6} lg={2}>
                  <div className="search-select-wrap">
                    <i className="bi bi-person-badge search-select-icon" />
                    <Form.Select className="form-control-soft search-select-input">
                      <option>Select Doctor</option>
                      {doctors.slice(0, 5).map((doctor) => (
                        <option key={doctor._id}>{doctor.user?.name}</option>
                      ))}
                    </Form.Select>
                    <i className="bi bi-chevron-down search-select-arrow" />
                  </div>
                </Col>
                <Col lg={1}>
                  <Button as={Link} to="/doctors" className="btn-teal search-square">
                    <i className="bi bi-search me-1" /> Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Container>
      </section>

      <div className="news-ticker">
        <div className="news-ticker-track">
          {[0, 1].map((i) => (
            <div className="news-ticker-content" key={i} aria-hidden={i === 1}>
              <i className="bi bi-broadcast-pin" />
              <strong>Advanced PET-CT Imaging now available at DocQ</strong>
              <span className="news-ticker-sep">—</span>
              <span>Schedule Your Appointment</span>
            </div>
          ))}
        </div>
      </div>

      <section className="sparsh-section white-section">
        <Container>
          <div className="sparsh-title text-center">
            <h2>Find the Right Doctor for Your Health</h2>
            <h3>Browse by Speciality</h3>
          </div>
          <div className="speciality-grid sparsh-speciality-grid">
            {specialities.map(([icon, title]) => (
              <Link to="/doctors" className="speciality-tile" key={title}>
                <img src={icon} alt="" />
                <span>{title}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/doctors" className="sparsh-view-link">
              View All
            </Link>
          </div>
        </Container>
      </section>

      <section className="sparsh-section blue-section">
        <Container>
          <div className="sparsh-title text-center">
            <h3>Our Partner Hospitals</h3>
          </div>
          <Row className="g-2 justify-content-center">
            {hospitals.map(([name, address, image]) => (
              <Col md={4} key={name}>
                <Card className="sparsh-hospital-card h-100">
                  <div className="sparsh-hospital-image" style={{ backgroundImage: `url("${image}")` }} />
                  <Card.Body>
                    <h5>{name}</h5>
                    <p>{address}</p>
                  </Card.Body>
                  <div className="sparsh-card-actions">
                    <Link to="/doctors">
                      <i className="bi bi-chevron-right" /> Explore
                    </Link>
                    <Link to="/doctors">
                      <i className="bi bi-person" /> Find Doctor
                    </Link>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Link to="/doctors" className="sparsh-view-link">
              View All
            </Link>
          </div>
        </Container>
      </section>

      <section className="sparsh-section white-section">
        <Container>
          <div className="sparsh-title text-center">
            <h2>Trusted by Thousands</h2>
            <h3>Meet Our Doctors</h3>
          </div>

          <Row className="g-2 justify-content-center mt-1">
            {doctors.slice(0, 4).map((doctor) => {
              const imageUrl = mediaUrl(
                doctor.profileImage,
                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80"
              );
              return (
                <Col md={3} sm={6} key={doctor._id}>
                  <Link to={`/doctors/${doctor._id}`} className="sparsh-doctor-card">
                    <img src={imageUrl} alt={doctor.user?.name} />
                    <div>
                      <strong>{doctor.user?.name}</strong>
                      <span>{doctor.specialization}</span>
                      <small>{doctor.location}</small>
                    </div>
                  </Link>
                </Col>
              );
            })}
          </Row>

          <div className="text-center mt-4">
            <Link to="/doctors" className="sparsh-view-link">
              View All Doctors
            </Link>
          </div>
        </Container>
      </section>

      <section className="sparsh-section blue-section facilities-blue">
        <Container>
          <div className="sparsh-title text-center">
            <h2>Everything You Need in One Place</h2>
            <h3>Platform Features</h3>
          </div>
          <div className="facility-grid sparsh-facility-grid">
            {facilities.map(([icon, title]) => (
              <div className="facility-item" key={title}>
                <i className={`bi ${icon}`} />
                <span>{title}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>


      <section className="why-sparsh sparsh-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={7}>
              <div className="sparsh-title">
                <h3 className="text-white">Why Choose DocQ?</h3>
              </div>
              <p>
                DocQ makes finding and booking a doctor simple, fast, and reliable.
                Browse verified specialists across multiple hospitals, choose your preferred
                time slot, and manage your appointments — all from one platform.
              </p>
              <div className="stats-row">
                <div>
                  <strong>50,000+</strong>
                  <span>Appointments booked</span>
                </div>
                <div>
                  <strong>100+</strong>
                  <span>Specialities</span>
                </div>
                <div>
                  <strong>500+</strong>
                  <span>Verified Doctors</span>
                </div>
              </div>
            </Col>
            <Col lg={5}>
              <h2 className="why-care-title">Book the Right Doctor. At the Right Time.</h2>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
