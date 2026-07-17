import Button from "../ui/Button";
import Container from "../ui/Container";
import CONFIG from "../../constants/config";

function Hero() {
  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <p className="text-teal-600 font-semibold uppercase tracking-wider">
              AI Powered Travel Planner
            </p>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mt-4 leading-tight">
              {CONFIG.tagline}
            </h1>

            <p className="text-gray-600 mt-6 text-lg leading-8">
              Discover destinations, generate personalized itineraries,
              estimate budgets, and explore the world with the help of AI.
            </p>

            <div className="flex gap-4 mt-8">
              <Button className="bg-teal-500 text-white hover:bg-teal-600">
                Start Planning
              </Button>

              <Button className="border border-slate-300 hover:bg-gray-100">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex justify-center">
            <div className="w-full max-w-md h-80 rounded-3xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-7xl shadow-xl">
              🌍✈️
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}

export default Hero;