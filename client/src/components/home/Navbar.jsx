import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar({ openAuth }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      className="
  sticky top-0 z-50
  w-full flex items-center
  justify-between rounded-none
  border-b border-gray-200
  bg-white/90 px-12 py-4
  shadow-lg backdrop-blur-xl
"
    >
      {/* Logo */}

      <div className="flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600">
        ✈
    </div>

    <div className="flex flex-col">
        <span className="text-xl font-bold text-black">
            Voyagent AI
        </span>

        <span className="text-xs text-gray-500">
            AI Travel Planner
        </span>
    </div>
</div>

      {/* Navigation */}

      <div className="hidden gap-8 md:flex">
        <a href="#features" className="text-gray-700 hover:text-cyan-500">
          Features
        </a>

        <a href="#destinations" className="text-gray-700 hover:text-cyan-500">
          Destinations
        </a>

        <a href="#about" className="text-gray-700 hover:text-cyan-500">
          About
        </a>
      </div>

      {/* Buttons */}

<div className="flex items-center gap-4">
  <button
    onClick={openAuth}
    className="text-gray-700 transition hover:text-cyan-500"
  >
    Login
  </button>

  <button
    onClick={openAuth}
    className="
      rounded-xl bg-cyan-500
      px-5 py-2 font-semibold
      transition hover:bg-cyan-400
    "
  >
    Get Started
  </button>
</div>
    </motion.nav>
  );
}

export default Navbar;