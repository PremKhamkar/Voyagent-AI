import { useState } from "react";

import Navbar from "../../components/home/Navbar";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import PopularDestinations from "../../components/home/PopularDestinations";
import HowItWorks from "../../components/home/HowItWorks";
import Testimonials from "../../components/home/Testimonials";
import CTA from "../../components/home/CTA";
import Footer from "../../components/home/Footer";

import AuthModal from "../../components/auth/AuthModal";
import AuthContainer from "../../components/auth/AuthContainer";

function Landing() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <Navbar openAuth={() => setIsAuthOpen(true)} />

      <Hero openAuth={() => setIsAuthOpen(true)} />
      <Features />
      <PopularDestinations />
      <HowItWorks />
      <Testimonials />
      <CTA openAuth={() => setIsAuthOpen(true)} />
      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      >
        <AuthContainer />
      </AuthModal>
    </>
  );
}

export default Landing;