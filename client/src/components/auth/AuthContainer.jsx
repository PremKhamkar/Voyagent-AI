import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";

function AuthContainer() {
  const [activeTab, setActiveTab] = useState("login");

  const destinations = [
  {
    name: "Paris",
    country: "France",
    rating: "★★★★★",
    description: "Experience the city of lights.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
  },
  {
    name: "Goa",
    country: "India",
    rating: "★★★★★",
    description: "Relax on beautiful beaches.",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200",
  },
  {
    name: "Tokyo",
    country: "Japan",
    rating: "★★★★★",
    description: "Discover futuristic adventures.",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200",
  },
  {
    name: "Switzerland",
    country: "Switzerland",
    rating: "★★★★★",
    description: "Explore breathtaking mountains.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
  },
];
const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide(
      (previous) => (previous + 1) % destinations.length
    );
  }, 4000);

  return () => clearInterval(interval);
}, []);

  return (
    <div className="grid min-h-[650px] md:grid-cols-2">
      {/* Left section */}

      <div className="relative hidden overflow-hidden md:flex">
  <img
    src={destinations[currentSlide].image}
    alt={destinations[currentSlide].name}
    className="
      absolute inset-0
      h-full w-full
      object-cover
      transition-all duration-1000
    "
  />

  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
  <motion.div
  animate={{
    x: [-50, 250, 550, 850],
    y: [0, -20, 10, -10],
    rotate: [0, 5, -5, 0],
  }}
  transition={{
    duration: 12,
    repeat: Infinity,
    ease: "linear",
  }}
  className="absolute left-0 top-20 z-10"
>
  <Plane
    className="h-10 w-10 text-white"
    strokeWidth={2.5}
  />
</motion.div>

  <div
    className="
      relative z-10
      flex h-full flex-col
      justify-end p-12 text-white
    "
  >
    <div className="mb-4 flex items-center gap-3">
  <span
    className="
      rounded-full bg-white/20
      px-4 py-2 text-sm
      backdrop-blur-md
    "
  >
    📍 {destinations[currentSlide].country}
  </span>

  <span className="text-yellow-300">
    {destinations[currentSlide].rating}
  </span>
</div>

    <h1 className="text-5xl font-bold">
      {destinations[currentSlide].name}
    </h1>

    <p className="mt-4 max-w-md text-lg leading-8 text-gray-200">
      {destinations[currentSlide].description}
    </p>

    <div className="mt-8 flex gap-3">
      {destinations.map((_, index) => (
        <div
          key={index}
          className={`h-2 w-8 rounded-full ${
            index === currentSlide
              ? "bg-white"
              : "bg-white/40"
          }`}
        />
      ))}
    </div>
  </div>
</div>
      {/* Right section */}

      <div
  className="
    border-l border-white/20
    bg-white/80 p-8
    backdrop-blur-xl
  "
>
        <div
  className="
    mb-8 flex rounded-2xl
    border border-gray-200
    bg-gray-100/80 p-1
    shadow-sm
  "
>
          <button
          className={`flex-1 rounded-xl py-3 font-medium transition-all duration-300 ${
              activeTab === "login"
                ? "bg-cyan-500 text-white shadow-md"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>

          <button
            className={`flex-1 rounded-xl py-3 ${
              activeTab === "register"
                ? "bg-cyan-500 text-white"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        <AnimatePresence mode="wait">

          <motion.div
  animate={{
    x: [-100, 700],
  }}
  transition={{
    duration: 25,
    repeat: Infinity,
    ease: "linear",
  }}
  className="absolute left-0 top-12 z-10"
>
  <div className="text-5xl opacity-70">☁️</div>
</motion.div>

<motion.div
  animate={{
    x: [700, -100],
  }}
  transition={{
    duration: 35,
    repeat: Infinity,
    ease: "linear",
  }}
  className="absolute right-0 top-40 z-10"
>
  <div className="text-4xl opacity-50">☁️</div>
</motion.div>
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 }}
    transition={{ duration: 0.3 }}
  >
    {activeTab === "login" ? (
      <Login
        isModal
        switchToRegister={() =>
          setActiveTab("register")
        }
      />
    ) : (
      <Register
        isModal
        switchToLogin={() =>
          setActiveTab("login")
        }
      />
    )}
  </motion.div>
</AnimatePresence>
      </div>
    </div>
  );
}

export default AuthContainer;