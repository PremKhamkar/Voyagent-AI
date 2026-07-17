import Navbar from "../../components/home/Navbar";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import PopularDestinations from "../../components/home/PopularDestinations";
import HowItWorks from "../../components/home/HowItWorks";
import Testimonials from "../../components/home/Testimonials";
import CTA from "../../components/home/CTA";

function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <PopularDestinations />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </>
  );
}

export default Landing;