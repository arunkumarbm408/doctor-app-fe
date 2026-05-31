import { useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DoctorCard from "../components/common/DoctorCard";
import {
  fetchDoctors,
  fetchLocations,
  fetchSpecializations,
} from "../features/doctors/doctorsSlice";

const filterSuggestions = (options, value) => {
  const term = value.trim().toLowerCase();
  return term ? options.filter((o) => o.toLowerCase().includes(term)) : options;
};

const buildMetaParams = (filters, excludeField) => {
  const params = {};
  if (excludeField !== "specialization" && filters.specialization.trim())
    params.specialization = filters.specialization.trim();
  if (excludeField !== "location" && filters.location.trim())
    params.location = filters.location.trim();
  return params;
};

const DoctorsPage = () => {
  const dispatch = useDispatch();
  const { doctors, loading, specializations, locations, metaLoading } =
    useSelector((state) => state.doctors);
  const [filters, setFilters] = useState({ specialization: "", location: "" });
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    dispatch(fetchSpecializations());
    dispatch(fetchLocations());
    dispatch(fetchDoctors({ limit: 50 }));
  }, [dispatch]);

  const specializationSuggestions = useMemo(
    () => filterSuggestions(specializations, filters.specialization),
    [specializations, filters.specialization]
  );
  const locationSuggestions = useMemo(
    () => filterSuggestions(locations, filters.location),
    [locations, filters.location]
  );

  const applyDoctorFilters = async (nextFilters) => {
    const params = { limit: 50 };
    if (nextFilters.specialization?.trim())
      params.specialization = nextFilters.specialization.trim();
    if (nextFilters.location?.trim())
      params.location = nextFilters.location.trim();
    await dispatch(fetchDoctors(params));
  };

  const handleReset = () => {
    setFilters({ specialization: "", location: "" });
    setActiveMenu("");
    dispatch(fetchSpecializations());
    dispatch(fetchLocations());
    dispatch(fetchDoctors({ limit: 50 }));
  };

  const openSpecializationMenu = () => {
    setActiveMenu("specialization");
    dispatch(fetchSpecializations(buildMetaParams(filters, "specialization")));
  };
  const openLocationMenu = () => {
    setActiveMenu("location");
    dispatch(fetchLocations(buildMetaParams(filters, "location")));
  };
  const selectSpecialization = async (value) => {
    const nextFilters = { ...filters, specialization: value };
    setFilters(nextFilters);
    setActiveMenu("");
    dispatch(fetchLocations(buildMetaParams(nextFilters, "location")));
    await applyDoctorFilters(nextFilters);
  };
  const selectLocation = async (value) => {
    const nextFilters = { ...filters, location: value };
    setFilters(nextFilters);
    setActiveMenu("");
    dispatch(fetchSpecializations(buildMetaParams(nextFilters, "specialization")));
    await applyDoctorFilters(nextFilters);
  };

  const hasFilters = filters.specialization || filters.location;

  return (
    <div className="find-doctor-page">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="find-doctor-hero">
        <Container>
          <div className="find-doctor-hero-content">
            <h1 className="find-doctor-hero-title">
              Find & Book a Doctor<br />
              <span>Near You</span>
            </h1>

            {/* Search panel */}
            <div className="find-doctor-search-panel">
              <div className="find-doctor-search-group">
                <label>
                  <i className="bi bi-search-heart" /> Speciality
                </label>
                <div className="typeahead-wrap">
                  <Form.Control
                    className="find-doctor-input"
                    placeholder="e.g. Cardiology, Orthopaedics"
                    value={filters.specialization}
                    onFocus={openSpecializationMenu}
                    onChange={(e) => {
                      setFilters((f) => ({ ...f, specialization: e.target.value }));
                      setActiveMenu("specialization");
                    }}
                    onBlur={() => setTimeout(() => setActiveMenu(""), 120)}
                    autoComplete="off"
                  />
                  {activeMenu === "specialization" && specializationSuggestions.length > 0 && (
                    <div className="typeahead-menu">
                      {specializationSuggestions.map((o) => (
                        <button key={o} type="button" className="typeahead-item" onMouseDown={() => selectSpecialization(o)}>
                          <i className="bi bi-chevron-right" /> {o}
                        </button>
                      ))}
                    </div>
                  )}
                  {activeMenu === "specialization" && !metaLoading && specializationSuggestions.length === 0 && (
                    <div className="typeahead-menu">
                      <div className="typeahead-item text-muted">No results found</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="find-doctor-search-divider" />

              <div className="find-doctor-search-group">
                <label>
                  <i className="bi bi-geo-alt-fill" /> Location
                </label>
                <div className="typeahead-wrap">
                  <Form.Control
                    className="find-doctor-input"
                    placeholder="e.g. Bengaluru, Mumbai"
                    value={filters.location}
                    onFocus={openLocationMenu}
                    onChange={(e) => {
                      setFilters((f) => ({ ...f, location: e.target.value }));
                      setActiveMenu("location");
                    }}
                    onBlur={() => setTimeout(() => setActiveMenu(""), 120)}
                    autoComplete="off"
                  />
                  {activeMenu === "location" && locationSuggestions.length > 0 && (
                    <div className="typeahead-menu">
                      {locationSuggestions.map((o) => (
                        <button key={o} type="button" className="typeahead-item" onMouseDown={() => selectLocation(o)}>
                          <i className="bi bi-chevron-right" /> {o}
                        </button>
                      ))}
                    </div>
                  )}
                  {activeMenu === "location" && !metaLoading && locationSuggestions.length === 0 && (
                    <div className="typeahead-menu">
                      <div className="typeahead-item text-muted">No results found</div>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="find-doctor-search-btn"
                onClick={() => applyDoctorFilters(filters)}
              >
                <i className="bi bi-search" />
                Search
              </button>
            </div>

            {/* Quick stats */}
            <div className="find-doctor-hero-stats">
              <div><strong>500+</strong><span>Verified Doctors</span></div>
              <div><strong>100+</strong><span>Specialities</span></div>
              <div><strong>4</strong><span>Hospitals</span></div>
              <div><strong>50K+</strong><span>Appointments</span></div>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Results ───────────────────────────────────────────────── */}
      <div className="find-doctor-results">
        <Container>
          {/* Results bar */}
          <div className="find-doctor-results-bar">
            <div className="find-doctor-results-count">
              {loading ? (
                <span className="text-muted">Searching doctors…</span>
              ) : (
                <>
                  <strong>{doctors.length}</strong> doctor{doctors.length !== 1 ? "s" : ""} found
                  {hasFilters && (
                    <span className="find-doctor-filter-tags">
                      {filters.specialization && (
                        <span className="find-doctor-tag">
                          {filters.specialization}
                          <button onClick={() => selectSpecialization("")}>×</button>
                        </span>
                      )}
                      {filters.location && (
                        <span className="find-doctor-tag">
                          {filters.location}
                          <button onClick={() => selectLocation("")}>×</button>
                        </span>
                      )}
                    </span>
                  )}
                </>
              )}
            </div>
            {hasFilters && (
              <button className="find-doctor-clear-btn" onClick={handleReset}>
                <i className="bi bi-x-circle" /> Clear all filters
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="find-doctor-loading">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="find-doctor-skeleton" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !doctors.length && (
            <div className="find-doctor-empty">
              <i className="bi bi-person-x" />
              <h5>No doctors found</h5>
              <p>Try adjusting your filters or search for a different speciality / location.</p>
              <Button className="btn-teal" size="sm" onClick={handleReset}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Doctor grid */}
          {!loading && doctors.length > 0 && (
            <Row className="g-4">
              {doctors.map((doctor) => (
                <Col md={6} lg={4} key={doctor._id}>
                  <DoctorCard doctor={doctor} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default DoctorsPage;
