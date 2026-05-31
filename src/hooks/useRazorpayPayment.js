import { useDispatch, useSelector } from "react-redux";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../features/appointments/appointmentsSlice";
import { loadRazorpayScript, openRazorpayCheckout } from "../utils/razorpayCheckout";

const useRazorpayPayment = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const processPayment = async ({ appointmentId, doctorName }) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) throw new Error("Could not load Razorpay. Check your connection.");

    const orderResult = await dispatch(createRazorpayOrder(appointmentId));
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
        appointmentId,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      })
    );

    if (verifyResult.error) throw new Error(verifyResult.payload || "Payment verification failed");

    return paymentResponse;
  };

  return { processPayment };
};

export default useRazorpayPayment;
