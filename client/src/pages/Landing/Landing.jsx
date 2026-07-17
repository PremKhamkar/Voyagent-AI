import Navbar from "../../components/home/Navbar";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import PopularDestinations from "../../components/home/PopularDestinations";
import HowItWorks from "../../components/home/HowItWorks";

function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <PopularDestinations />
      <HowItWorks />
    </>
  );
}

export default Landing;