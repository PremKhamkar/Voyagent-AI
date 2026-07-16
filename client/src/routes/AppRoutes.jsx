import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Planner from "../pages/Planner/Planner";
import Profile from "../pages/Profile/Profile";
import SavedTrips from "../pages/SavedTrips/SavedTrips";
import Settings from "../pages/Settings/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/planner" element={<Planner />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/saved-trips" element={<SavedTrips />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default AppRoutes;