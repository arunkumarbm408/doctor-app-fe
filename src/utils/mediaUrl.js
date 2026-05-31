const apiOrigin = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api(?:\/v1)?\/?$/, "");

export const mediaUrl = (url, fallback = "") => {
  if (!url) return fallback;
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
};
