import { Form } from "react-bootstrap";

const iconStyle = {
  left: "1rem",
  top: "50%",
  transform: "translateY(-50%)",
  color: "var(--text-4)",
};

const IconInput = ({ icon, ...props }) => (
  <div className="position-relative">
    <Form.Control className="form-control-soft ps-5" {...props} />
    <i className={`bi ${icon} position-absolute`} style={iconStyle} />
  </div>
);

export default IconInput;
