import { Navigate, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Planner from "../pages/Planner/Planner";
import Profile from "../pages/Profile/Profile";
import SavedTrips from "../pages/SavedTrips/SavedTrips";
import Settings from "../pages/Settings/Settings";
import ProtectedRoute from "../components/ProtectedRoute";
import SavedTripDetails from "../pages/SavedTripDetails/SavedTripDetails";

function PublicRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================== */}

      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* =========================
          PROTECTED ROUTES
      ========================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <Planner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/saved-trips"
        element={
          <ProtectedRoute>
            <SavedTrips />
          </ProtectedRoute>
        }
      />

      <Route
      path="/saved-trips/:tripId"
      element={
      <ProtectedRoute>
        <SavedTripDetails />
        </ProtectedRoute>
      }
    />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;