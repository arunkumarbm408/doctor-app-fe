import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div
    style={{
      background: "var(--bg-2)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
    }}
  >
    <Container className="py-5 text-center">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-4 mb-4"
        style={{
          width: 80,
          height: 80,
          background: "var(--teal-soft)",
          color: "var(--teal)",
          fontSize: "2rem",
          border: "2px solid var(--teal-border)",
        }}
      >
        <i className="bi bi-compass" />
      </div>

      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "7rem",
          fontWeight: 800,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          color: "var(--border)",
          marginBottom: "1rem",
        }}
      >
        404
      </div>

      <h1 className="page-title mb-3">Page not found</h1>
      <p
        className="page-subtitle mb-5"
        style={{ maxWidth: 400, margin: "0 auto 2rem" }}
      >
        The page you requested could not be found. It may have been moved or the URL may be
        incorrect.
      </p>

      <div className="d-flex gap-3 justify-content-center flex-wrap">
        <Button as={Link} to="/" size="lg" className="pill-button btn-teal">
          <i className="bi bi-house me-2" />
          Go home
        </Button>
        <Button
          as={Link}
          to="/doctors"
          variant="outline-secondary"
          size="lg"
          className="pill-button"
        >
          <i className="bi bi-search me-2" />
          Find doctors
        </Button>
      </div>
    </Container>
  </div>
);

export default NotFoundPage;
