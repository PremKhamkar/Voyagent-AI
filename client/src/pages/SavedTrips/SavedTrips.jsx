import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function SavedTrips() {
  const [savedTrips, setSavedTrips] = useState([]);

  const userEmail =
    localStorage.getItem("userEmail") || "";

  useEffect(() => {
    if (!userEmail) {
      setSavedTrips([]);
      return;
    }

    const storageKey =
      `voyagent_saved_trips_${userEmail}`;

    const trips = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    setSavedTrips(trips);
  }, [userEmail]);

  function handleDeleteTrip(tripId) {
    const storageKey =
      `voyagent_saved_trips_${userEmail}`;

    const updatedTrips = savedTrips.filter(
      (trip) => trip.id !== tripId
    );

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedTrips)
    );

    setSavedTrips(updatedTrips);
  }

  function formatDate(date) {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
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

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Your journeys
            </p>

            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Saved Trips
            </h1>

            <p className="mt-2 text-slate-500">
              Keep your favorite travel plans ready for your next adventure.
            </p>
          </div>

          <Link
            to="/planner"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-cyan-500
              px-5
              py-3
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-cyan-500/20
              transition
              hover:-translate-y-0.5
              hover:bg-cyan-400
            "
          >
            ✨ Plan New Trip
          </Link>

        </div>

        {/* Trip count */}
        {savedTrips.length > 0 && (
          <div className="mb-6">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              🧳 {savedTrips.length}{" "}
              {savedTrips.length === 1
                ? "Saved Trip"
                : "Saved Trips"}
            </span>
          </div>
        )}

        {/* Empty State */}
        {savedTrips.length === 0 ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-cyan-50 text-5xl">
              🧳
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              No saved trips yet
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-slate-500">
              Your saved AI travel plans will appear here.
              Create a trip in the planner and save it for
              easy access later.
            </p>

            <Link
              to="/planner"
              className="
                mt-7
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-slate-900
                px-6
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-slate-800
              "
            >
              Start Planning →
            </Link>

          </section>
        ) : (
          /* Saved Trips */
          <div className="grid gap-6 md:grid-cols-2">

            {savedTrips.map((trip) => (
              <article
                key={trip.id}
                className="
                  overflow-hidden
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >

                {/* Trip Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 px-6 py-7 text-white">

                  <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-white/10" />

                  <div className="relative">

                    <div className="mb-3 flex items-center justify-between">

                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                        {trip.travelType || "Travel"}
                      </span>

                      <span className="text-2xl">
                        ✈️
                      </span>

                    </div>

                    <h2 className="text-2xl font-black">
                      {trip.destination}
                    </h2>

                    <p className="mt-1 text-sm text-white/80">
                      From {trip.sourceCity || "Your City"}
                    </p>

                  </div>
                </div>

                {/* Trip Details */}
                <div className="p-6">

                  <div className="grid grid-cols-2 gap-4">

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Dates
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {formatDate(trip.startDate)}
                      </p>

                      <p className="text-xs text-slate-500">
                        to {formatDate(trip.endDate)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Duration
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {getTripDuration(
                          trip.startDate,
                          trip.endDate
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Budget
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        ₹{trip.budget}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Travelers
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        👥 {trip.travelers}
                      </p>
                    </div>

                  </div>

                  {/* Preferences */}
                  {trip.preferences?.length > 0 && (
                    <div className="mt-5">

                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Preferences
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {trip.preferences.map(
                          (preference) => (
                            <span
                              key={preference}
                              className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700"
                            >
                              {preference}
                            </span>
                          )
                        )}
                      </div>

                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteTrip(trip.id)
                      }
                      className="
                        rounded-xl
                        border
                        border-red-200
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-red-500
                        transition
                        hover:bg-red-50
                      "
                    >
                      🗑 Delete
                    </button>

                    <Link
  to={`/saved-trips/${trip.id}`}
  className="
    flex-1
    rounded-xl
    bg-slate-900
    px-4
    py-3
    text-center
    text-sm
    font-bold
    text-white
    transition
    hover:bg-slate-800
  "
>
  View Trip →
</Link>

                  </div>

                </div>
              </article>
            ))}

          </div>
        )}

        {/* Back */}
        <div className="mt-10 text-center">
          <Link
            to="/dashboard"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}

export default SavedTrips;