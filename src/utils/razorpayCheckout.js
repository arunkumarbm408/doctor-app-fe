export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const openRazorpayCheckout = ({
  keyId,
  orderId,
  amount,
  currency = "INR",
  doctorName,
  user,
  onSuccess,
  onDismiss,
}) =>
  new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Razorpay SDK failed to load"));
      return;
    }

    const options = {
      key: keyId,
      amount,
      currency,
      name: "DocQ",
      description: `Consultation with ${doctorName || "doctor"}`,
      order_id: orderId,
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      theme: { color: "#1e3a5f" },
      handler: (response) => {
        onSuccess?.(response);
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          onDismiss?.();
          reject(new Error("Payment cancelled"));
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      reject(new Error(response.error?.description || "Payment failed"));
    });
    rzp.open();
  });
