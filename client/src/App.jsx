import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import TripAssistant from "./components/chatbot/TripAssistant";

// The Planner owns its own context-aware TripAssistant (shown once a
// trip is generated), so the general assistant must never appear
// there. The auth pages are kept uncluttered.
const GENERAL_ASSISTANT_HIDDEN_PATHS = [
  "/planner",
  "/login",
  "/register",
];

function App() {
  const { pathname } = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("voyagent_token"))
  );

  useEffect(() => {
    function handleAuthChange() {
      setIsAuthenticated(
        Boolean(localStorage.getItem("voyagent_token"))
      );
    }

    window.addEventListener("voyagent-auth-change", handleAuthChange);

    return () => {
      window.removeEventListener(
        "voyagent-auth-change",
        handleAuthChange
      );
    };
  }, []);

  // Router matching is case-insensitive and tolerates a trailing slash.
  const normalizedPath =
    pathname.toLowerCase().replace(/\/+$/, "") || "/";

  const showGeneralAssistant =
    isAuthenticated &&
    !GENERAL_ASSISTANT_HIDDEN_PATHS.includes(normalizedPath);

  return (
    <>
      <AppRoutes />

      {/* Mounted outside the routes so the chat history survives
          navigation. When hidden it stays mounted but is not displayed
          (display: none), so it keeps its history and can't be seen or
          focused. */}
      <div className={showGeneralAssistant ? "" : "hidden"}>
        <TripAssistant />
      </div>
    </>
  );
}

export default App;