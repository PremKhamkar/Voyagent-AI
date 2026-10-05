import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import API_BASE_URL from "../constants/api";

function ProtectedRoute({ children }) {
  const location = useLocation();

  // "checking" | "authorized" | "unauthorized"
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let isCancelled = false;

    async function verifySession() {
      const token = localStorage.getItem("voyagent_token");

      if (!token) {
        if (!isCancelled) setStatus("unauthorized");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Session is no longer valid.");
        }

        const user = await response.json();

        // Keep the display-only session flags in sync with what the
        // server actually confirmed, in case they'd gone stale.
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);

        if (!isCancelled) setStatus("authorized");
      } catch (error) {
        // Token missing, invalid, expired, or the backend is
        // unreachable — clear the stale session so the rest of the
        // app doesn't keep thinking we're logged in.
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("voyagent_token");
        window.dispatchEvent(new Event("voyagent-auth-change"));

        if (!isCancelled) setStatus("unauthorized");
      }
    }

    verifySession();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-sm text-slate-500">
          Checking your session...
        </p>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;