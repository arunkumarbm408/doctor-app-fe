import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

const AppNavbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const initial = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="site-header sticky-top">
      {/* ── Topbar ─────────────────────────────────────────────────── */}
      <div className="topbar-shell">
        <Container className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="topbar-links">
            <Link to="/doctors">
              <i className="bi bi-search-heart" />
              Consult a Doctor
            </Link>
            <Link to="/doctors">
              <i className="bi bi-clipboard2-pulse" />
              Health Check-ups
            </Link>
            <Link to="/doctors">
              <i className="bi bi-capsule" />
              Specialities
            </Link>
            <Link to="/doctors">
              <i className="bi bi-activity" />
              Emergency Care
            </Link>
          </div>
          <a href="tel:08045309999" className="topbar-phone">
            <i className="bi bi-telephone-fill" />
            080 4530 9999
          </a>
        </Container>
      </div>

      {/* ── Main Navbar ─────────────────────────────────────────────── */}
      <Navbar expand="lg" className="nav-shell">
        <Container>
          {/* Brand */}
          <Navbar.Brand as={Link} to="/" className="brand-mark">
            <img src="/docq-logo.png" alt="DocQ Hospital" className="brand-logo-img" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-nav" className="border-0 shadow-none" />

          <Navbar.Collapse id="main-nav">
            {/* Nav links */}
            <Nav className="mx-auto nav-center">
              <Nav.Link as={NavLink} to="/" end className="nav-link-soft">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/doctors" className="nav-link-soft">
                Find a Doctor
              </Nav.Link>
              <NavDropdown
                title="Specialities"
                id="specialities-nav-dropdown"
                className="nav-dropdown-soft"
              >
                <NavDropdown.Header>Partner Hospitals</NavDropdown.Header>
                <NavDropdown.Item as={Link} to="/hospitals/sarjapur-road">
                  <i className="bi bi-hospital me-2 text-danger" />
                  DocQ Hospital, RajajiNagar
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/hospitals/hennur-road">
                  <i className="bi bi-hospital me-2 text-danger" />
                  DocQ Hospital, Dr Rajakumar Road
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/hospitals/rr-nagar">
                  <i className="bi bi-hospital me-2 text-danger" />
                  DocQ Hospital, RR Nagar
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/hospitals/women-children">
                  <i className="bi bi-hospital me-2 text-danger" />
                  DocQ Women and Children
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/doctors">
                  <i className="bi bi-grid me-2" />
                  View All Doctors
                </NavDropdown.Item>
              </NavDropdown>
              {user && (
                <Nav.Link
                  as={NavLink}
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="nav-link-soft"
                >
                  My Dashboard
                </Nav.Link>
              )}
              <Nav.Link as={NavLink} to="/contact" className="nav-link-soft">
                Contact Us
              </Nav.Link>
            </Nav>

            {/* Auth area */}
            <div className="nav-auth-area">
              {user ? (
                /* ── Logged in ── */
                <>
                  <div className="nav-user-card">
                    <div className="nav-avatar">{initial}</div>
                    <div className="nav-user-info">
                      <span className="nav-user-name">{user.name}</span>
                      <span className="nav-user-role">{user.role}</span>
                    </div>
                  </div>
                  <Link to="/doctors" className="nav-book-btn">
                    <i className="bi bi-calendar2-plus" />
                    Book Now
                  </Link>
                  <button className="nav-logout-btn" onClick={handleLogout} title="Logout">
                    <i className="bi bi-box-arrow-right" />
                  </button>
                </>
              ) : (
                /* ── Logged out ── */
                <>
                  <Link to="/login" className="nav-signin-link">
                    Sign In
                  </Link>
                  <Link to="/doctor-register" className="nav-join-btn">
                    Join as Doctor
                  </Link>
                  <Link to="/register" className="nav-book-btn">
                    <i className="bi bi-calendar2-plus" />
                    Book Appointment
                  </Link>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default AppNavbar;
