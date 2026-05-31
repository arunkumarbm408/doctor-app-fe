import { useState } from "react";
import { Button } from "react-bootstrap";
import useRazorpayPayment from "../../hooks/useRazorpayPayment";

const RazorpayPayButton = ({
  appointment,
  doctorName,
  size = "sm",
  className = "pill-button btn-teal",
  onPaid,
}) => {
  const { processPayment } = useRazorpayPayment();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setError("");
    setPaying(true);
    try {
      await processPayment({ appointmentId: appointment._id, doctorName });
      onPaid?.();
    } catch (err) {
      if (err.message !== "Payment cancelled") {
        setError(err.message || "Payment failed");
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <div>
      <Button size={size} className={className} disabled={paying} onClick={handlePay}>
        {paying ? (
          <>
            <span className="spinner-border spinner-border-sm me-1" role="status" />
            Processing…
          </>
        ) : (
          <>
            <i className="bi bi-credit-card me-1" />
            Pay with Razorpay
          </>
        )}
      </Button>
      {error && (
        <div className="text-danger mt-1" style={{ fontSize: "0.75rem" }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default RazorpayPayButton;
