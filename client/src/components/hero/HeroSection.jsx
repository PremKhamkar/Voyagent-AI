function HeroSection() {
  return (
    <div className="py-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">

        {/* Left section */}

        <div>
          <p className="mb-4 text-sm font-semibold tracking-widest text-cyan-400">
            AI-POWERED TRAVEL PLANNER
          </p>

          <h1 className="mb-6 text-5xl font-bold leading-tight">
            Plan Smarter.
            <br />
            Travel Better.
          </h1>

          <p className="max-w-xl text-lg text-gray-300">
            Discover destinations, estimate budgets,
            explore tourist attractions, and create
            intelligent AI-powered itineraries.
          </p>
        </div>

        {/* Right section */}

        <div
          className="
            flex
            h-56
            items-center
            justify-center
            rounded-3xl
            bg-gradient-to-br
            from-cyan-500
            via-sky-500
            to-blue-600
            text-8xl
            shadow-2xl
          "
        >
          ✈️
        </div>

      </div>
    </div>
  );
}

export default HeroSection;