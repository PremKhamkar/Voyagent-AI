// Central place for the backend's base URL.
//
// In development, this falls back to your local FastAPI server if
// VITE_API_BASE_URL isn't set in client/.env. Before deploying, set
// VITE_API_BASE_URL to your real backend URL so the app doesn't stay
// pointed at 127.0.0.1.

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default API_BASE_URL;