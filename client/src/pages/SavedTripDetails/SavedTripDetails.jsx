import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function SavedTripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);

  const userEmail =
    localStorage.getItem("userEmail") || "";

  useEffect(() => {
    if (!userEmail) {
      navigate("/login", { replace: true });
      return;
    }

    const storageKey =
      `voyagent_saved_trips_${userEmail}`;

    const savedTrips = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    const selectedTrip = savedTrips.find(
      (savedTrip) =>
        String(savedTrip.id) === String(tripId)
    );

    setTrip(selectedTrip || null);
  }, [tripId, userEmail, navigate]);

  function formatDate(date) {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  function getTripDuration(startDate, endDate) {
    if (!startDate || !endDate) return "";

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference =
      Math.ceil(
        (end - start) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    return `${difference} ${
      difference === 1 ? "Day" : "Days"
    }`;
  }

  function handleDeleteTrip() {
    if (!trip || !userEmail) return;

    const storageKey =
      `voyagent_saved_trips_${userEmail}`;

    const savedTrips = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    const updatedTrips = savedTrips.filter(
      (savedTrip) => savedTrip.id !== trip.id
    );

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedTrips)
    );

    navigate("/saved-trips", { replace: true });
  }

  if (!trip) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-4xl">

          <Link
            to="/saved-trips"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Saved Trips
          </Link>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl">
              ⚠️
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Trip not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              This saved trip may have been deleted or
              is no longer available.
            </p>

            <Link
              to="/saved-trips"
              className="mt-6 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              View Saved Trips
            </Link>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Back Navigation */}
        <div className="mb-6 flex items-center justify-between">

          <Link
            to="/saved-trips"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Saved Trips
          </Link>

          <button
            type="button"
            onClick={handleDeleteTrip}
            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            🗑 Delete Trip
          </button>

        </div>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-8 text-white shadow-xl md:p-10">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10" />

          <div className="relative">

            <div className="mb-5 flex flex-wrap items-center gap-3">

              <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
                {trip.travelType || "Travel"}
              </span>

              <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
                🧳 Saved Trip
              </span>

            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              {trip.destination}
            </h1>

            <p className="mt-3 text-lg text-white/80">
              {trip.sourceCity || "Your City"} →{" "}
              {trip.destination}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  Dates
                </p>
                <p className="mt-1 text-sm font-bold">
                  {formatDate(trip.startDate)}
                </p>
                <p className="text-xs text-white/70">
                  to {formatDate(trip.endDate)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  Duration
                </p>
                <p className="mt-1 text-sm font-bold">
                  {getTripDuration(
                    trip.startDate,
                    trip.endDate
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  Budget
                </p>
                <p className="mt-1 text-sm font-bold">
                  ₹{trip.budget}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  Travelers
                </p>
                <p className="mt-1 text-sm font-bold">
                  👥 {trip.travelers}
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* Preferences */}
        {trip.preferences?.length > 0 && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              ✨ Travel Preferences
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {trip.preferences.map(
                (preference) => (
                  <span
                    key={preference}
                    className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700"
                  >
                    {preference}
                  </span>
                )
              )}
            </div>

          </section>
        )}

        {/* AI Itinerary */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
              🗺️
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                AI Travel Itinerary
              </h2>

              <p className="text-sm text-slate-500">
                Your personalized day-by-day travel plan
              </p>
            </div>
          </div>

          {trip.itinerary ? (
            <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {trip.itinerary}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-slate-500">
              No itinerary information was saved.
            </p>
          )}

        </section>

        {/* Information Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Weather */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-xl">
                🌦️
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Weather Information
                </h2>
                <p className="text-sm text-slate-500">
                  Weather guidance for your trip
                </p>
              </div>
            </div>

            {trip.weatherInfo ? (
              <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-li:text-slate-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {trip.weatherInfo}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No weather information was saved.
              </p>
            )}

          </section>

          {/* Budget */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                💰
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Budget Plan
                </h2>
                <p className="text-sm text-slate-500">
                  AI-generated expense planning
                </p>
              </div>
            </div>

            {trip.budgetPlan ? (
              <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-li:text-slate-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {trip.budgetPlan}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No budget plan was saved.
              </p>
            )}

          </section>

          {/* Destination */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl">
                📍
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Destination Guide
                </h2>
                <p className="text-sm text-slate-500">
                  Places and attractions to explore
                </p>
              </div>
            </div>

            {trip.destinationPlan ? (
              <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-li:text-slate-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {trip.destinationPlan}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No destination information was saved.
              </p>
            )}

          </section>

          {/* Accommodation */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                🏨
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Accommodation
                </h2>
                <p className="text-sm text-slate-500">
                  Suggested stay information
                </p>
              </div>
            </div>

            {trip.accommodationPlan ? (
              <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-li:text-slate-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {trip.accommodationPlan}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No accommodation information was saved.
              </p>
            )}

          </section>

        </div>

        {/* Bottom CTA */}
        <section className="mt-8 rounded-3xl bg-slate-900 p-8 text-center text-white">

          <h2 className="text-2xl font-black">
            Ready for another adventure?
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm text-white/60">
            Create a new personalized itinerary with
            Voyagent AI.
          </p>

          <Link
            to="/planner"
            className="mt-6 inline-flex rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-cyan-400"
          >
            ✨ Plan Another Trip
          </Link>

        </section>

      </div>
    </main>
  );
}

export default SavedTripDetails;