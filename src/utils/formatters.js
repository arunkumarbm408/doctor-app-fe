export const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const titleCase = (text = "") =>
  text.charAt(0).toUpperCase() + text.slice(1);
