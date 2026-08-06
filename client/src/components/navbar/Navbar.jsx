import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        sticky top-4 z-50
        mx-auto
        flex max-w-7xl items-center justify-between
        rounded-2xl border border-white/10
        bg-white/5 px-6 py-4
        backdrop-blur-xl
      "
    >
      {/* Logo */}

      <div className="flex items-center gap-2">
        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl bg-gradient-to-r
            from-cyan-500 to-indigo-600
          "
        >
          ✈
        </div>

        <h1 className="text-xl font-bold">
          Voyagent AI
        </h1>
      </div>

      {/* Navigation links */}

      <div className="hidden gap-8 md:flex">
        <a href="#features" className="text-gray-300 hover:text-white">
          Features
        </a>

        <a href="#destinations" className="text-gray-300 hover:text-white">
          Destinations
        </a>

        <a href="#about" className="text-gray-300 hover:text-white">
          About
        </a>
      </div>

      {/* Buttons */}

      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-gray-300 transition hover:text-white"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="
            rounded-xl bg-cyan-500
            px-5 py-2 font-semibold
            transition hover:bg-cyan-400
          "
        >
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
}

export default Navbar;