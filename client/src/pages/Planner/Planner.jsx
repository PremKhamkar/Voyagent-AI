import { useState } from "react";
import { Link } from "react-router-dom";

import AgentFlow from "../../components/planner/AgentFlow";
import TripAssistant from "../../components/chatbot/TripAssistant";
import WeatherCard from "../../components/cards/WeatherCard";
import BudgetCard from "../../components/cards/BudgetCard";
import AttractionCard from "../../components/cards/AttractionCard";
import AccommodationCard from "../../components/cards/AccommodationCard";
import GoogleMap from "../../components/maps/GoogleMap";
import LocationPicker from "../../components/location/LocationPicker";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Planner() {
  const [trip, setTrip] = useState({
    sourceCity: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: 1,
    travelType: "Leisure",
    preferences: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [generatedTrip, setGeneratedTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);

  const [weatherInfo, setWeatherInfo] = useState("");
  const [budgetPlan, setBudgetPlan] = useState("");
  const [destinationPlan, setDestinationPlan] = useState("");
  const [accommodationPlan, setAccommodationPlan] = useState("");

  const [isSaved, setIsSaved] = useState(false);

  function handleItineraryUpdate(updatedItinerary) {
    setItinerary(updatedItinerary);
    setIsSaved(false);
  }

  const preferences = [
    "Culture",
    "Food",
    "Beaches",
    "Adventure",
    "Shopping",
    "Historical",
    "Relaxation",
    "Nightlife",
  ];

  function handleChange(event) {
    const { name, value } = event.target;

    setTrip((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  function handlePreferenceChange(preference) {
    setTrip((previous) => {
      const alreadySelected =
        previous.preferences.includes(preference);

      return {
        ...previous,
        preferences: alreadySelected
          ? previous.preferences.filter(
            (item) => item !== preference
          )
          : [...previous.preferences, preference],
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!trip.sourceCity.trim()) {
      newErrors.sourceCity = "Source city is required.";
    }

    if (!trip.destination.trim()) {
      newErrors.destination = "Destination is required.";
    }

    if (!trip.startDate) {
      newErrors.startDate = "Start date is required.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedStartDate = new Date(trip.startDate);
      selectedStartDate.setHours(0, 0, 0, 0);

      if (selectedStartDate < today) {
        newErrors.startDate =
          "Start date cannot be in the past.";
      }
    }

    if (!trip.endDate) {
      newErrors.endDate = "End date is required.";
    }

    if (
      trip.startDate &&
      trip.endDate &&
      trip.endDate < trip.startDate
    ) {
      newErrors.endDate =
        "End date cannot be before start date.";
    }

    if (!trip.budget || Number(trip.budget) <= 0) {
      newErrors.budget = "Budget must be greater than 0.";
    }

    if (Number(trip.travelers) < 1) {
      newErrors.travelers =
        "At least 1 traveler is required.";
    }

    if (
      trip.sourceCity &&
      trip.destination &&
      trip.sourceCity.trim().toLowerCase() ===
      trip.destination.trim().toLowerCase()
    ) {
      newErrors.destination =
        "Source and destination cannot be the same.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    setGeneratedTrip(null);
    setItinerary(null);
    setWeatherInfo("");
    setBudgetPlan("");
    setDestinationPlan("");
    setAccommodationPlan("");
    setIsSaved(false);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/generate-trip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trip),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Failed to generate your trip."
        );
      }

      setGeneratedTrip(data.trip);
      setItinerary(data.itinerary);

      setWeatherInfo(data.weather_info || "");
      setBudgetPlan(data.budget_plan || "");
      setDestinationPlan(data.destination_plan || "");
      setAccommodationPlan(
        data.accommodation_plan || ""
      );
    } catch (error) {
      console.error("Error:", error);

      setErrors({
        submit:
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSaveTrip() {
    if (!generatedTrip || !itinerary) {
      return;
    }

    const userEmail =
      localStorage.getItem("userEmail");

    if (!userEmail) {
      setErrors({
        submit:
          "Unable to identify your account. Please log in again.",
      });

      return;
    }

    const storageKey =
      `voyagent_saved_trips_${userEmail}`;

    const existingTrips = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    const alreadyExists = existingTrips.some(
      (savedTrip) =>
        savedTrip.destination ===
        generatedTrip.destination &&
        savedTrip.startDate ===
        generatedTrip.startDate &&
        savedTrip.endDate ===
        generatedTrip.endDate &&
        savedTrip.budget ===
        generatedTrip.budget
    );

    if (alreadyExists) {
      setIsSaved(true);
      return;
    }

    const savedTrip = {
      id: Date.now(),

      savedAt: new Date().toISOString(),

      sourceCity: generatedTrip.sourceCity,

      destination: generatedTrip.destination,

      startDate: generatedTrip.startDate,

      endDate: generatedTrip.endDate,

      budget: generatedTrip.budget,

      travelers: generatedTrip.travelers,

      travelType: generatedTrip.travelType,

      preferences:
        generatedTrip.preferences || [],

      itinerary,

      weatherInfo,

      budgetPlan,

      destinationPlan,

      accommodationPlan,
    };

    const updatedTrips = [
      savedTrip,
      ...existingTrips,
    ];

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedTrips)
    );

    setIsSaved(true);
  }

  // Location Picker handlers
  const handleSourceLocationChange = (location) => {
    setTrip((prev) => ({
      ...prev,
      sourceCity: location?.name || "",
    }));

    setErrors((prev) => ({
      ...prev,
      sourceCity: "",
    }));
  };

  const handleDestinationLocationChange = (location) => {
    setTrip((prev) => ({
      ...prev,
      destination: location?.name || "",
    }));

    setErrors((prev) => ({
      ...prev,
      destination: "",
    }));
  };
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                text-lg
              "
            >
              ✈️
            </div>

            <span className="text-xl font-bold text-slate-800">
              Voyagent AI
            </span>
          </Link>

          <Link
            to="/"
            className="
              text-sm
              font-medium
              text-slate-500
              transition
              hover:text-slate-900
            "
          >
            Back to Home
          </Link>

        </div>
      </header>

      {/* Planner */}
      <main className="px-6 py-10">

        <div className="mx-auto max-w-6xl">

          {/* Form Card */}
          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-8
              shadow-sm
            "
          >

            <div className="mb-8">
              <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-800">
                <span>✈️</span>
                Enter Travel Requirements
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Tell us about your trip and let Voyagent AI
                create a personalized travel plan.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Source + Destination */}
              <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">

                {/* Source */}
                <div>
                  <LocationPicker
                    label="From"
                    type="source"
                    value={
                      trip.sourceCity
                        ? { name: trip.sourceCity }
                        : null
                    }
                    onChange={handleSourceLocationChange}
                    placeholder="Search your starting location..."
                  />

                  {errors.sourceCity && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.sourceCity}
                    </p>
                  )}
                </div>

                {/* Swap */}
                <button
                  type="button"
                  onClick={() => {
                    setTrip((prev) => ({
                      ...prev,
                      sourceCity: prev.destination,
                      destination: prev.sourceCity,
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      sourceCity: "",
                      destination: "",
                    }));
                  }}
                  disabled={!trip.sourceCity && !trip.destination}
                  className="mx-auto mt-[3.65rem] flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm transition hover:border-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                  aria-label="Swap source and destination"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 7h11l-3-3" />
                    <path d="M17 17H6l3 3" />
                  </svg>
                </button>

                {/* Destination */}
                <div>
                  <LocationPicker
                    label="To"
                    type="destination"
                    value={
                      trip.destination
                        ? { name: trip.destination }
                        : null
                    }
                    onChange={handleDestinationLocationChange}
                    placeholder="Where do you want to go?"
                  />

                  {errors.destination && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.destination}
                    </p>
                  )}
                </div>

              </div>

              {/* Dates */}
              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Start Date *
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={trip.startDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-slate-800
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-100
                    "
                  />

                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    End Date *
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={trip.endDate}
                    min={
                      trip.startDate ||
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-slate-800
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-100
                    "
                  />

                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.endDate}
                    </p>
                  )}
                </div>

              </div>

              {/* Budget + Travelers + Travel Style */}
              <div className="grid gap-6 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Budget (₹) *
                  </label>

                  <input
                    type="number"
                    name="budget"
                    value={trip.budget}
                    onChange={handleChange}
                    placeholder="50000"
                    min="1"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-slate-800
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-100
                    "
                  />

                  {errors.budget && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.budget}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Travelers
                  </label>

                  <input
                    type="number"
                    name="travelers"
                    value={trip.travelers}
                    onChange={handleChange}
                    min="1"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-slate-800
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-100
                    "
                  />

                  {errors.travelers && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.travelers}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Travel Style
                  </label>

                  <select
                    name="travelType"
                    value={trip.travelType}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-slate-800
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-100
                    "
                  >
                    <option value="Leisure">
                      Leisure
                    </option>

                    <option value="Solo">
                      Solo
                    </option>

                    <option value="Couple">
                      Couple
                    </option>

                    <option value="Family">
                      Family
                    </option>

                    <option value="Friends">
                      Friends
                    </option>

                    <option value="Business">
                      Business
                    </option>
                  </select>
                </div>

              </div>

              {/* Preferences */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Trip Preferences & Interests
                </label>

                <div className="flex flex-wrap gap-2">

                  {preferences.map((preference) => {
                    const selected =
                      trip.preferences.includes(
                        preference
                      );

                    return (
                      <button
                        key={preference}
                        type="button"
                        onClick={() =>
                          handlePreferenceChange(
                            preference
                          )
                        }
                        className={`
                          rounded-xl
                          px-4
                          py-2
                          text-sm
                          font-medium
                          transition
                          ${selected
                            ? "bg-teal-500 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }
                        `}
                      >
                        {selected ? "✓ " : "+ "}
                        {preference}
                      </button>
                    );
                  })}

                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errors.submit}
                </div>
              )}

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  bg-gradient-to-r
                  from-teal-500
                  to-blue-600
                  px-6
                  py-4
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:scale-[1.01]
                  hover:shadow-md
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading
                  ? "Generating AI Travel Plan..."
                  : "⚡ Generate AI Travel Plan"}
              </button>

              {/* Agent Flow */}
              {loading && (
                <div className="pt-2">
                  <AgentFlow />
                </div>
              )}

            </form>
          </div>

          {/* Generated Trip */}
          {generatedTrip && (
            <div
              className="
                mt-8
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <h2 className="text-2xl font-bold text-slate-800">
                  🗺️ Generated Trip Summary
                </h2>

                <button
                  type="button"
                  onClick={handleSaveTrip}
                  disabled={isSaved}
                  className={`
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    shadow-sm
                    transition-all
                    duration-200
                    ${isSaved
                      ? "cursor-default bg-emerald-100 text-emerald-700"
                      : "bg-cyan-600 text-white hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-md"
                    }
                  `}
                >
                  {isSaved
                    ? "✓ Trip Saved"
                    : "💾 Save Trip"}
                </button>

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <p>
                  <strong>🌍 From:</strong>{" "}
                  {generatedTrip.sourceCity}
                </p>

                <p>
                  <strong>📍 Destination:</strong>{" "}
                  {generatedTrip.destination}
                </p>

                <p>
                  <strong>📅 Dates:</strong>{" "}
                  {generatedTrip.startDate} →{" "}
                  {generatedTrip.endDate}
                </p>

                <p>
                  <strong>💰 Budget:</strong>{" "}
                  ₹{generatedTrip.budget}
                </p>

                <p>
                  <strong>👥 Travelers:</strong>{" "}
                  {generatedTrip.travelers}
                </p>

                <p>
                  <strong>✈️ Travel Style:</strong>{" "}
                  {generatedTrip.travelType}
                </p>

                <p className="md:col-span-2">
                  <strong>🎯 Preferences:</strong>{" "}
                  {generatedTrip.preferences?.join(
                    ", "
                  ) || "None selected"}
                </p>

              </div>
            </div>
          )}

          {/* Google Map */}
          {generatedTrip && (
            <GoogleMap
              sourceCity={generatedTrip.sourceCity}
              destination={generatedTrip.destination}
            />
          )}

          {/* AI Itinerary */}
          {itinerary && (
            <div
              className="
                mt-8
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >
              <div
                className="
                  border-b
                  border-slate-200
                  bg-gradient-to-r
                  from-teal-50
                  to-blue-50
                  px-6
                  py-6
                "
              >
                <div className="flex items-start gap-4">

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-r
                      from-teal-500
                      to-blue-600
                      text-xl
                      text-white
                      shadow-sm
                    "
                  >
                    ✨
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Your AI Travel Itinerary
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      A personalized day-by-day plan created for your trip.
                    </p>
                  </div>

                </div>
              </div>

              <div className="p-6 md:p-8">

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => (
                      <div
                        className="
                          mt-8
                          mb-6
                          overflow-hidden
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-50
                          first:mt-0
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            bg-gradient-to-r
                            from-teal-500
                            to-blue-600
                            px-5
                            py-4
                            text-white
                          "
                        >
                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              bg-white/20
                              font-bold
                            "
                          >
                            📅
                          </div>

                          <h3 className="text-lg font-bold">
                            {children}
                          </h3>
                        </div>
                      </div>
                    ),

                    h3: ({ children }) => {
                      const text = String(children);

                      let icon = "📍";

                      if (text.includes("Morning")) {
                        icon = "🌅";
                      } else if (
                        text.includes("Afternoon")
                      ) {
                        icon = "☀️";
                      } else if (
                        text.includes("Evening")
                      ) {
                        icon = "🌆";
                      } else if (
                        text.includes("Estimated")
                      ) {
                        icon = "💰";
                      } else if (
                        text.includes("Travel Tip")
                      ) {
                        icon = "💡";
                      }

                      return (
                        <div
                          className="
                            mt-6
                            mb-3
                            flex
                            items-center
                            gap-2
                            text-base
                            font-bold
                            text-slate-800
                          "
                        >
                          <span>{icon}</span>
                          <span>{children}</span>
                        </div>
                      );
                    },

                    p: ({ children }) => (
                      <p className="mb-3 text-sm leading-7 text-slate-600">
                        {children}
                      </p>
                    ),

                    strong: ({ children }) => (
                      <strong className="font-semibold text-slate-800">
                        {children}
                      </strong>
                    ),

                    ul: ({ children }) => (
                      <ul className="mb-4 space-y-2 pl-5 text-sm text-slate-600">
                        {children}
                      </ul>
                    ),

                    li: ({ children }) => (
                      <li className="leading-6">
                        {children}
                      </li>
                    ),

                    a: ({ children, href }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          font-medium
                          text-cyan-600
                          underline
                          decoration-cyan-300
                          underline-offset-2
                          hover:text-cyan-700
                        "
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {itinerary}
                </ReactMarkdown>

              </div>
            </div>
          )}

          {/* AI Planning Cards */}
          {(weatherInfo ||
            budgetPlan ||
            destinationPlan ||
            accommodationPlan) && (
              <div className="mt-8 grid gap-6">

                <WeatherCard
                  content={weatherInfo}
                />

                <BudgetCard
                  content={budgetPlan}
                />

                <AttractionCard
                  content={destinationPlan}
                />

                <AccommodationCard
                  content={accommodationPlan}
                />

              </div>
            )}

          {/* Saved Trips Link */}
          {generatedTrip && (
            <div className="mt-8 flex justify-center pb-6">
              <Link
                to="/saved-trips"
                className="
                  text-sm
                  font-semibold
                  text-cyan-600
                  transition
                  hover:text-cyan-700
                "
              >
                View Saved Trips →
              </Link>
            </div>
          )}

          {/* Trip Assistant */}
          {generatedTrip && itinerary && (
            <TripAssistant
              trip={generatedTrip}
              itinerary={itinerary}
              weatherInfo={weatherInfo}
              budgetPlan={budgetPlan}
              destinationPlan={destinationPlan}
              accommodationPlan={accommodationPlan}
              onItineraryUpdate={handleItineraryUpdate}
            />
          )}

        </div>
      </main>
    </div>
  );
}

export default Planner;