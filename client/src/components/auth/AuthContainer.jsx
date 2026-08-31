import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";

function AuthContainer() {
  const [activeTab, setActiveTab] = useState("login");
  const [currentSlide, setCurrentSlide] = useState(0);

  const destinations = [
    {
      city: "Paris",
      country: "France",
      description:
        "Experience beautiful architecture, culture, and cuisine.",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600",
    },
    {
      city: "Tokyo",
      country: "Japan",
      description:
        "A perfect blend of tradition and modern technology.",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600",
    },
    {
      city: "Goa",
      country: "India",
      description:
        "Relax on beautiful beaches and enjoy the nightlife.",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (previous) => (previous + 1) % destinations.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [destinations.length]);

  const destination = destinations[currentSlide];

  function handleTabChange() {
    setActiveTab((current) =>
      current === "login" ? "register" : "login"
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-cols-1 overflow-hidden lg:grid-cols-2">

      {/* =====================================================
          LEFT — DESTINATION SHOWCASE
      ====================================================== */}

      <div className="relative hidden min-h-0 overflow-hidden lg:block">

        {/* Background Image */}

        <img
          key={destination.city}
          src={destination.image}
          alt={destination.city}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            transition-opacity
            duration-700
          "
        />

        {/* Dark Gradient */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/80
            via-black/25
            to-black/10
          "
        />

        {/* Brand */}

        <div className="absolute left-8 top-8 z-20">
          <h1 className="text-2xl font-bold tracking-wide text-white">
            Voyagent
          </h1>
        </div>

        {/* Destination Information */}

        <div className="absolute bottom-8 left-8 right-8 z-20">

          <div
            className="
              max-w-xl
              rounded-3xl
              border
              border-white/20
              bg-black/25
              p-7
              text-white
              shadow-2xl
              backdrop-blur-xl
            "
          >

            <span
              className="
                text-xs
                font-medium
                uppercase
                tracking-[0.25em]
                text-white/70
              "
            >
              Featured Destination
            </span>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              {destination.city}
            </h2>

            <p className="mt-1 text-base text-white/80">
              {destination.country}
            </p>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
              {destination.description}
            </p>

            {/* Slide Indicators */}

            <div className="mt-6 flex items-center gap-2">
              {destinations.map((item, index) => (
                <button
                  key={item.city}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Show ${item.city}`}
                  className={`
                    h-1.5
                    rounded-full
                    transition-all
                    duration-500
                    ${
                      index === currentSlide
                        ? "w-9 bg-white"
                        : "w-1.5 bg-white/40 hover:bg-white/70"
                    }
                  `}
                />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT — AUTHENTICATION
      ====================================================== */}

      <div
        className="
          flex
          min-h-0
          flex-col
          bg-white
        "
      >

  

        {/* Scrollable Authentication Content */}

        <div 
  className="
    min-h-0
    flex-1
    overflow-y-auto
    px-8
    pb-8
    pt-8
    lg:px-12
    lg:pb-10
    lg:pt-6
  " 
>

          <div className="mx-auto w-full max-w-md">

            {/* Heading */}

            <div className="mb-6 text-center">

              <h2
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  lg:text-4xl
                "
              >
                {activeTab === "login"
                  ? "Welcome Back"
                  : "Create Account"}
              </h2>

              <p className="mt-2 text-sm text-slate-500 lg:text-base">
                {activeTab === "login"
                  ? "Sign in to continue your journey."
                  : "Create an account and start exploring."}
              </p>

            </div>

            {/* Authentication Form */}

            <motion.div
              key={activeTab}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
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

          </div>

        </div>
      </div>
    </div>
  );
}

export default AuthContainer;