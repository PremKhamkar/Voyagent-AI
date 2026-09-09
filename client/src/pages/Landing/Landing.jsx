import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../../components/home/Navbar";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import PopularDestinations from "../../components/home/PopularDestinations";
import HowItWorks from "../../components/home/HowItWorks";
import Testimonials from "../../components/home/Testimonials";
import CTA from "../../components/home/CTA";
import Footer from "../../components/home/Footer";

function Landing() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;

    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const sectionId = hash.substring(1);

    const timer = setTimeout(() => {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <PopularDestinations />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}

export default Landing;