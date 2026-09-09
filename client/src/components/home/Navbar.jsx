import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  const userName =
    localStorage.getItem("userName") || "Traveler";

  const userEmail =
    localStorage.getItem("userEmail") || "";

  const firstName = userName.split(" ")[0];

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("rememberMe");

    setIsMenuOpen(false);

    navigate("/", { replace: true });
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        sticky top-0 z-50
        flex w-full items-center justify-between
        border-b border-white/10
        bg-slate-900/70
        px-6 py-4
        shadow-lg
        backdrop-blur-xl
      "
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2"
      >
        <div
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            bg-gradient-to-r
            from-cyan-500
            to-indigo-600
            text-white
          "
        >
          ✈
        </div>

        <h1 className="text-xl font-bold text-white">
          Voyagent AI
        </h1>
      </Link>

      {/* Main Navigation */}
      <div className="hidden items-center gap-8 md:flex">
        <Link
          to="/#features"
          className="
            text-sm font-medium
            text-white/80
            transition
            hover:text-white
          "
        >
          Features
        </Link>

        <Link
          to="/#destinations"
          className="
            text-sm font-medium
            text-white/80
            transition
            hover:text-white
          "
        >
          Destinations
        </Link>

        <Link
          to="/#about"
          className="
            text-sm font-medium
            text-white/80
            transition
            hover:text-white
          "
        >
          About
        </Link>
      </div>

      {/* Right Side */}
      <div className="relative flex items-center gap-4">
        {!isLoggedIn ? (
          <>
            {/* Login */}
            <Link
              to="/login"
              className="
                text-sm font-medium
                text-white/80
                transition
                hover:text-white
              "
            >
              Login
            </Link>

            {/* Get Started */}
            <Link
              to="/register"
              className="
                rounded-xl
                bg-cyan-500
                px-5 py-2.5
                text-sm font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-cyan-400
                hover:shadow-md
              "
            >
              Get Started
            </Link>
          </>
        ) : (
          <>
            {/* Logged-in User Button */}
            <button
              type="button"
              onClick={() =>
                setIsMenuOpen(
                  (previous) => !previous
                )
              }
              className="
                flex items-center gap-2
                rounded-xl
                border border-white/15
                bg-white/10
                px-3 py-2
                text-white
                shadow-sm
                backdrop-blur-md
                transition
                hover:bg-white/20
              "
            >
              {/* Avatar */}
              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-full
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  text-sm font-bold
                  text-white
                "
              >
                {firstName.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <span
                className="
                  hidden
                  text-sm
                  font-semibold
                  sm:block
                "
              >
                {firstName}
              </span>

              {/* Arrow */}
              <span className="text-xs text-white/60">
                ▾
              </span>
            </button>

            {/* Account Dropdown */}
            {isMenuOpen && (
              <div
                className="
                  absolute right-0 top-14
                  z-[100]
                  w-60
                  overflow-hidden
                  rounded-2xl
                  border border-white/10
                  bg-slate-900/95
                  shadow-2xl
                  backdrop-blur-xl
                "
              >
                {/* User Information */}
                <div
                  className="
                    border-b border-white/10
                    px-4 py-4
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-10 w-10
                        shrink-0
                        items-center justify-center
                        rounded-full
                        bg-gradient-to-r
                        from-cyan-500
                        to-blue-600
                        text-sm font-bold
                        text-white
                      "
                    >
                      {firstName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {userName}
                      </p>

                      {userEmail && (
                        <p className="mt-0.5 truncate text-xs text-white/50">
                          {userEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="
                    flex items-center gap-3
                    px-4 py-3
                    text-sm text-white/80
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="
                    flex items-center gap-3
                    px-4 py-3
                    text-sm text-white/80
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <span>👤</span>
                  <span>Profile</span>
                </Link>

                {/* Saved Trips */}
                <Link
                  to="/saved-trips"
                  onClick={() => setIsMenuOpen(false)}
                  className="
                    flex items-center gap-3
                    px-4 py-3
                    text-sm text-white/80
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <span>🧳</span>
                  <span>Saved Trips</span>
                </Link>

                {/* Settings */}
                <Link
                  to="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="
                    flex items-center gap-3
                    px-4 py-3
                    text-sm text-white/80
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <span>⚙️</span>
                  <span>Settings</span>
                </Link>

                {/* Logout */}
                <div className="border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex w-full items-center gap-3
                      px-4 py-3
                      text-left
                      text-sm
                      text-red-400
                      transition
                      hover:bg-red-500/10
                      hover:text-red-300
                    "
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;