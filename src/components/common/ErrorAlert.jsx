import { Alert } from "react-bootstrap";

const ErrorAlert = ({ message }) =>
  message ? (
    <Alert
      variant="danger"
      className="d-flex align-items-center gap-2 py-2 mb-4"
      style={{ borderRadius: "var(--r-md)" }}
    >
      <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
      {message}
    </Alert>
  ) : null;

export default ErrorAlert;
