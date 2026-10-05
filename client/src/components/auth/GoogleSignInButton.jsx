import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import API_BASE_URL from "../../constants/api";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_SCRIPT_ID = "google-identity-services";

function GoogleSignInButton({ text = "signin_with" }) {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleGoogleResponse(response) {
    setError("");

    try {
      const result = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      const data = await result.json();

      if (!result.ok) {
        setError(data.detail || "Unable to sign in with Google.");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("voyagent_token", data.access_token);
      window.dispatchEvent(new Event("voyagent-auth-change"));

      navigate("/", { replace: true });
    } catch {
      setError(
        "Could not reach the server. Please make sure the backend is running.",
      );
    }
  }

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError("Google login is not configured.");
      return undefined;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      buttonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text,
        shape: "rectangular",
        width: 240,
      });
    };

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);

    if (existingScript) {
      if (window.google?.accounts?.id) {
        initializeGoogle();
      } else {
        existingScript.addEventListener("load", initializeGoogle);
      }

      return () => {
        existingScript.removeEventListener("load", initializeGoogle);
      };
    }

    const script = document.createElement("script");

    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;

    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [text]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={buttonRef} />

      {error && (
        <p className="text-center text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default GoogleSignInButton;