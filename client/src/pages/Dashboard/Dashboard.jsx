import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("rememberMe");

    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =========================
          HEADER
      ========================== */}

      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link to="/" className="flex items-center gap-3">
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
                Welcome back to Voyagent AI. Your travel dashboard
                is ready.
              </p>
            </div>
          </div>
        )}

        {/* Welcome */}

        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-600">
            Your Travel Dashboard
          </p>

          <h2 className="text-3xl font-bold text-slate-800">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-slate-500">
            Where would you like to travel today?
          </p>
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
              View Trips →
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
                Your latest travel plans
              </p>
            </div>

            <Link
              to="/saved-trips"
              className="text-sm font-semibold text-cyan-600 hover:text-cyan-700"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">

            <div className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
              <p className="font-semibold text-slate-800">
                Goa Trip
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Recent travel plan
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
              <p className="font-semibold text-slate-800">
                Manali Adventure
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Mountain getaway
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
              <p className="font-semibold text-slate-800">
                Dubai Vacation
              </p>

              <p className="mt-1 text-sm text-slate-500">
                International trip
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;