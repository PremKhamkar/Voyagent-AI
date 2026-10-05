import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRef = useRef(null);

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
    localStorage.removeItem("voyagent_token");

    setIsMenuOpen(false);
    window.dispatchEvent(new Event("voyagent-auth-change"));


    navigate("/", { replace: true });
  }
  // Close the account menu / mobile menu on Escape or an outside click.
  useEffect(() => {
    function closeMenus() {
      setIsMenuOpen(false);
      setIsMobileOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") closeMenus();
    }

    function handlePointerDown(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeMenus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  // Landing only scrolls when the hash changes, so clicking the link
  // for the hash already in the URL needs to scroll directly.
  function handleSectionClick(event, sectionId) {
    setIsMobileOpen(false);

    if (location.hash !== `#${sectionId}`) return;

    const section = document.getElementById(sectionId);

    if (section) {
      event.preventDefault();
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <motion.nav
      ref={navRef}
      aria-label="Main"
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      className="
  sticky top-0 z-50
  flex w-full flex-wrap items-center justify-between
  border-b border-white/10
  bg-slate-950/90
  px-4 py-4 sm:px-6
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

        <span className="text-xl font-bold tracking-tight text-white">
          Voyagent AI
        </span>
      </Link>

      {/* Main Navigation */}
      <div className="hidden items-center gap-2 md:flex">
        <Link
          to="/#features"
          onClick={(event) => handleSectionClick(event, "features")}
          className="
    text-sm font-medium
    text-slate-200
    transition
    hover:bg-white/10
    hover:text-white
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-teal-400
    rounded-lg px-3 py-2
  "
        >
          Features
        </Link>

        <Link
          to="/#destinations"
          onClick={(event) => handleSectionClick(event, "destinations")}
          className="
    text-sm font-medium
    text-slate-200
    transition
    hover:bg-white/10
    hover:text-white
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-teal-400
    rounded-lg px-3 py-2
  "
        >
          Destinations
        </Link>

        <Link
          to="/#about"
          onClick={(event) => handleSectionClick(event, "about")}
          className="
    text-sm font-medium
    text-slate-200
    transition
    hover:bg-white/10
    hover:text-white
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-teal-400
    rounded-lg px-3 py-2
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
                  hidden md:block
                  rounded-lg px-3 py-2
                  text-sm font-medium
                  text-slate-200
                  transition
                  hover:bg-white/10
                  hover:text-white
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-teal-400
                "
            >
              Login
            </Link>

            {/* Get Started */}
            <Link
              to="/register"
              className="
  hidden md:block
  rounded-xl
  bg-teal-500
  px-5 py-2.5
  text-sm font-semibold
  text-slate-950
  shadow-sm
  transition
  hover:bg-teal-400
  hover:shadow-md
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-white
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

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu"
          onClick={() => {
            setIsMobileOpen((previous) => !previous);
            setIsMenuOpen(false);
          }}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-white/15
            text-lg text-white
            transition
            hover:bg-white/10
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-teal-400
            md:hidden
          "
        >
          <span aria-hidden="true">
            {isMobileOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>
      {/* Mobile navigation panel */}
      {isMobileOpen && (
        <div
          id="mobile-menu"
          className="
            mt-3 flex w-full basis-full flex-col gap-1
            border-t border-white/10 pt-3
            md:hidden
          "
        >
          {[
            ["features", "Features"],
            ["destinations", "Destinations"],
            ["about", "About"],
          ].map(([id, label]) => (
            <Link
              key={id}
              to={`/#${id}`}
              onClick={(event) => handleSectionClick(event, id)}
              className="
                rounded-lg px-3 py-3
                text-sm font-medium
                text-slate-200
                transition
                hover:bg-white/10
                hover:text-white
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-teal-400
              "
            >
              {label}
            </Link>
          ))}

          {!isLoggedIn && (
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              <Link
                to="/login"
                onClick={() => setIsMobileOpen(false)}
                className="
                  rounded-xl border border-white/20
                  px-5 py-2.5
                  text-center text-sm font-semibold text-white
                  transition
                  hover:bg-white/10
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-teal-400
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setIsMobileOpen(false)}
                className="
                  rounded-xl bg-teal-500
                  px-5 py-2.5
                  text-center text-sm font-semibold text-slate-950
                  transition
                  hover:bg-teal-400
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                "
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </motion.nav>
  );
}

export default Navbar;