import Button from "../ui/Button";
import Container from "../ui/Container";
import { useEffect, useState } from "react";

function Hero({ openAuth }) {
  const images = [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600",
    "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1600",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((previous) => (previous + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div
        className="
absolute inset-0
w-full h-full
bg-cover bg-center
transition-all duration-1000
"
        style={{
          backgroundImage: `url(${images[currentImage]})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Content */}
      <div className="relative z-10">
        <Container>
          <div className="flex min-h-[700px] items-center">
            <div>
              <p className="font-semibold uppercase tracking-wider text-cyan-300">
                AI Powered Travel Planner
              </p>

              <h1 className="mt-4 text-6xl font-bold leading-tight text-white">
                Plan Smarter.
                <br />
                Travel Better.
              </h1>

              <p className="mt-6 max-w-xl text-xl leading-9 text-gray-200">
                Discover destinations, generate personalized itineraries,
                estimate budgets, and explore the world with the help of AI.
              </p>

              <div className="mt-8 flex gap-4">
                <Button
                onClick={openAuth}
                className="bg-teal-500 text-white hover:bg-teal-600"
                >
                Start Planning
                </Button>
                <Button className="border border-white bg-white/10 text-white hover:bg-white/20">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

export default Hero;