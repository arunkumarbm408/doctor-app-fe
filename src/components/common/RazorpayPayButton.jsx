import { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createRazorpayOrder, verifyRazorpayPayment } from "../../features/appointments/appointmentsSlice";
import { loadRazorpayScript, openRazorpayCheckout } from "../../utils/razorpayCheckout";

const RazorpayPayButton = ({ appointment, doctorName, size = "sm", className = "pill-button btn-teal", onPaid }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setError("");
    setPaying(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Could not load Razorpay. Check your connection.");

      const orderResult = await dispatch(createRazorpayOrder(appointment._id));
      if (orderResult.error) throw new Error(orderResult.payload || "Failed to create payment order");

      const order = orderResult.payload;
      const keyId = order.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId) throw new Error("Razorpay key is not configured");

      const paymentResponse = await openRazorpayCheckout({
        keyId,
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        doctorName: doctorName || order.doctorName,
        user,
      });

      const verifyResult = await dispatch(
        verifyRazorpayPayment({
          appointmentId: appointment._id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        })
      );

      if (verifyResult.error) throw new Error(verifyResult.payload || "Payment verification failed");

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
