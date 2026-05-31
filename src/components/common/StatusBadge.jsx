const badgeMap = {
  Pending: "badge-warning-soft",
  Approved: "badge-success-soft",
  Available: "badge-success-soft",
  Rejected: "badge-danger-soft",
  Completed: "badge-primary-soft",
  Cancelled: "badge-neutral-soft",
  Paid: "badge-success-soft",
  Refunded: "badge-neutral-soft",
  Reviewing: "badge-warning-soft",
  "Info Requested": "badge-warning-soft",
};

const StatusBadge = ({ value }) => (
  <span className={`status-badge ${badgeMap[value] || "badge-dark-soft"}`}>{value || "N/A"}</span>
);

export default StatusBadge;
