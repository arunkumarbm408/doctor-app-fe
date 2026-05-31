import { Link } from "react-router-dom";
import { currency } from "../../utils/formatters";
import { mediaUrl } from "../../utils/mediaUrl";

const DoctorCard = ({ doctor }) => {
  const imageUrl = mediaUrl(
    doctor.profileImage,
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80"
  );
  const isAvailable = doctor.isApproved;

  return (
    <div className="dc-card">
      {/* Photo */}
      <div className="dc-photo-wrap">
        <img src={imageUrl} alt={doctor.user?.name} className="dc-photo" />
        <span className={`dc-badge ${isAvailable ? "dc-badge--green" : "dc-badge--amber"}`}>
          <i className={`bi ${isAvailable ? "bi-patch-check-fill" : "bi-clock"}`} />
          {isAvailable ? "Available" : "Reviewing"}
        </span>
      </div>

      {/* Body */}
      <div className="dc-body">
        <div className="dc-name-row">
          <h5 className="dc-name">{doctor.user?.name}</h5>
        </div>
        <p className="dc-spec">{doctor.specialization}</p>
        {doctor.qualifications?.length > 0 && (
          <p className="dc-qual">
            {doctor.qualifications.slice(0, 2).join(" · ")}
          </p>
        )}

        <div className="dc-chips">
          <span className="dc-chip">
            <i className="bi bi-briefcase-fill" />
            {doctor.experience}+ yrs exp
          </span>
          <span className="dc-chip">
            <i className="bi bi-geo-alt-fill" />
            {doctor.location}
          </span>
          <span className="dc-chip dc-chip--fee">
            <i className="bi bi-currency-rupee" />
            {currency(doctor.fees)}
          </span>
        </div>

        <div className="dc-actions">
          <Link to={`/doctors/${doctor._id}`} className="dc-btn dc-btn--outline">
            View Profile
          </Link>
          <Link to={`/booking/${doctor._id}`} className="dc-btn dc-btn--primary">
            <i className="bi bi-calendar2-plus" />
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
