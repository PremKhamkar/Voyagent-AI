import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(true);
  const [savedTrips, setSavedTrips] = useState([]);

  const userName =
    localStorage.getItem("userName") || "Traveler";

  const userEmail =
    localStorage.getItem("userEmail") || "";

  const firstName = userName.split(" ")[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

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

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    navigate("/", { replace: true });
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

  const recentTrips = savedTrips.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =========================
          HEADER
      ========================== */}

      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg text-white">
              ✈
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Voyagent AI
              </h1>

              <p className="text-xs text-slate-500">
                Plan smarter. Travel better.
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">

            <Link
              to="/profile"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 font-bold text-cyan-700">
                {firstName
                  .charAt(0)
                  .toUpperCase()}
              </span>

              {firstName}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="
                rounded-xl
                border border-red-200
                bg-red-50
                px-5
                py-2.5
                text-sm
                font-semibold
                text-red-600
                transition
                hover:bg-red-100
              "
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* =========================
          MAIN
      ========================== */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Login Success */}

        {showSuccess && (
          <div
            className="
              mb-8
              flex
              items-start
              gap-4
              rounded-2xl
              border
              border-emerald-200
              bg-emerald-50
              p-5
              shadow-sm
            "
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-lg text-white">
              ✓
            </div>

            <div>
              <h2 className="font-semibold text-emerald-800">
                Login successful!
              </h2>

              <p className="mt-1 text-sm text-emerald-700">
                Welcome back to Voyagent AI. Your travel
                dashboard is ready.
              </p>
            </div>
          </div>
        )}

        {/* Welcome */}

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-600">
            Your Travel Dashboard
          </p>

          <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">
            Welcome Back, {firstName} 👋
          </h2>

          <p className="mt-2 text-slate-500">
            Where would you like to travel today?
          </p>
        </div>

        {/* =========================
            STATS
        ========================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Saved Trips
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-xl">
                🧳
              </span>
            </div>

            <p className="mt-3 text-3xl font-black text-slate-800">
              {savedTrips.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Your saved journeys
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Destinations
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                🌍
              </span>
            </div>

            <p className="mt-3 text-3xl font-black text-slate-800">
              {
                new Set(
                  savedTrips.map(
                    (trip) =>
                      trip.destination
                  )
                ).size
              }
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Unique places planned
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Travelers
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                👥
              </span>
            </div>

            <p className="mt-3 text-3xl font-black text-slate-800">
              {savedTrips.length > 0
                ? savedTrips.reduce(
                    (total, trip) =>
                      total +
                      Number(
                        trip.travelers || 0
                      ),
                    0
                  )
                : 0}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Travelers across saved trips
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Planned Budget
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-xl">
                💰
              </span>
            </div>

            <p className="mt-3 text-3xl font-black text-slate-800">
              ₹
              {savedTrips.reduce(
                (total, trip) =>
                  total +
                  Number(
                    trip.budget || 0
                  ),
                0
              )}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Across saved trips
            </p>
          </div>

        </div>

        {/* =========================
            ACTION CARDS
        ========================== */}

        <div className="grid gap-6 md:grid-cols-3">

          <Link
            to="/planner"
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            <div className="mb-4 text-4xl">
              🗺️
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Plan New Trip
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Let AI create your personalized itinerary,
              budget, accommodation and travel plan.
            </p>

            <div className="mt-5 font-semibold text-cyan-600">
              Start Planning →
            </div>
          </Link>

          <Link
            to="/saved-trips"
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            <div className="mb-4 text-4xl">
              📌
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Saved Trips
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              View and manage your previous travel plans
              and saved itineraries.
            </p>

            <div className="mt-5 font-semibold text-cyan-600">
              {savedTrips.length > 0
                ? `View ${savedTrips.length} ${
                    savedTrips.length === 1
                      ? "Trip"
                      : "Trips"
                  } →`
                : "Create Your First Trip →"}
            </div>
          </Link>

          <Link
            to="/profile"
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            <div className="mb-4 text-4xl">
              👤
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Profile
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage your profile and personalize your
              travel preferences.
            </p>

            <div className="mt-5 font-semibold text-cyan-600">
              View Profile →
            </div>
          </Link>

        </div>

        {/* =========================
            RECENT TRIPS
        ========================== */}

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Recent Trips
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest saved travel plans
              </p>
            </div>

            {savedTrips.length > 0 && (
              <Link
                to="/saved-trips"
                className="text-sm font-semibold text-cyan-600 hover:text-cyan-700"
              >
                View All
              </Link>
            )}

          </div>

          {recentTrips.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">

              <div className="mb-3 text-4xl">
                🧳
              </div>

              <h3 className="font-bold text-slate-800">
                No trips saved yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Create your first personalized AI travel
                plan and save it here for easy access.
              </p>

              <Link
                to="/planner"
                className="mt-5 inline-flex rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-400"
              >
                Plan Your First Trip →
              </Link>

            </div>

          ) : (

            <div className="space-y-3">

              {recentTrips.map((trip) => (

                <Link
                  key={trip.id}
                  to={`/saved-trips/${trip.id}`}
                  className="
                    block
                    rounded-xl
                    border
                    border-slate-200
                    p-4
                    transition
                    hover:border-cyan-200
                    hover:bg-slate-50
                  "
                >

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xl text-white">
                        ✈️
                      </div>

                      <div>
                        <p className="font-bold text-slate-800">
                          {trip.destination}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {trip.sourceCity ||
                            "Your City"}{" "}
                          →{" "}
                          {trip.destination}
                        </p>
                      </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs">

                      <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-600">
                        📅{" "}
                        {formatDate(
                          trip.startDate
                        )}
                      </span>

                      <span className="rounded-full bg-cyan-50 px-3 py-1.5 font-semibold text-cyan-700">
                        {getTripDuration(
                          trip.startDate,
                          trip.endDate
                        )}
                      </span>

                      <span className="font-bold text-slate-700">
                        ₹{trip.budget}
                      </span>

                      <span className="text-cyan-600">
                        →
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>

      </main>
    </div>
  );
}

export default Dashboard;