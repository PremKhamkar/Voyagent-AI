import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Profile() {
  const userName =
    localStorage.getItem("userName") || "Traveler";

  const userEmail =
    localStorage.getItem("userEmail") ||
    "No email available";

  const firstName = userName.split(" ")[0];

  const [savedTrips, setSavedTrips] = useState([]);

  useEffect(() => {
    if (!userEmail || userEmail === "No email available") {
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

  const destinationCount = new Set(
    savedTrips.map(
      (trip) => trip.destination
    )
  ).size;

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
              Account
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Your Profile
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your Voyagent AI account and travel preferences.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="
              inline-flex w-fit items-center justify-center
              rounded-xl
              border border-slate-200
              bg-white
              px-5 py-3
              text-sm font-semibold
              text-slate-700
              shadow-sm
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-slate-50
              hover:shadow-md
            "
          >
            ← Dashboard
          </Link>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Profile Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-8 py-10">

            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-white/10" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* Avatar */}
              <div
                className="
                  flex h-24 w-24 shrink-0
                  items-center justify-center
                  rounded-full
                  border-4 border-white/30
                  bg-white/20
                  text-3xl font-bold
                  text-white
                  shadow-xl
                  backdrop-blur-sm
                "
              >
                {firstName.charAt(0).toUpperCase()}
              </div>

              {/* User Details */}
              <div className="min-w-0">
                <p className="mb-1 text-sm font-medium text-white/70">
                  Welcome back
                </p>

                <h2 className="truncate text-3xl font-bold text-white">
                  {userName}
                </h2>

                <p className="mt-1 truncate text-sm text-white/75">
                  {userEmail}
                </p>

                <div className="mt-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
                  ✈️ Voyagent AI Traveler
                </div>
              </div>

            </div>
          </div>

          {/* Account Information */}
          <div className="p-8">

            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Account Information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your basic account details.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Full Name */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-lg">
                    👤
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Full Name
                    </p>

                    <p className="mt-1 truncate text-base font-semibold text-slate-800">
                      {userName}
                    </p>
                  </div>

                </div>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg">
                    ✉️
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Email Address
                    </p>

                    <p className="mt-1 truncate text-base font-semibold text-slate-800">
                      {userEmail}
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* Travel Statistics */}
            <div className="mt-8 border-t border-slate-100 pt-8">

              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Travel Statistics
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your Voyagent AI planning activity.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Saved Trips
                      </p>

                      <p className="mt-2 text-3xl font-black text-slate-800">
                        {savedTrips.length}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Saved travel plans
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-2xl">
                      🧳
                    </div>

                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Destinations
                      </p>

                      <p className="mt-2 text-3xl font-black text-slate-800">
                        {destinationCount}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Unique destinations planned
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                      🌍
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 border-t border-slate-100 pt-8">

              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Quick Actions
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Continue planning and managing your journeys.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {/* Plan Trip */}
                <Link
                  to="/planner"
                  className="
                    group
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    transition-all duration-200
                    hover:-translate-y-1
                    hover:border-cyan-200
                    hover:shadow-md
                  "
                >
                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-xl">
                      ✈️
                    </div>

                    <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-cyan-500">
                      →
                    </span>

                  </div>

                  <h4 className="mt-4 font-bold text-slate-800">
                    Plan a Trip
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Create your next AI-powered travel itinerary.
                  </p>
                </Link>

                {/* Saved Trips */}
                <Link
                  to="/saved-trips"
                  className="
                    group
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    transition-all duration-200
                    hover:-translate-y-1
                    hover:border-blue-200
                    hover:shadow-md
                  "
                >
                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                      🧳
                    </div>

                    <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500">
                      →
                    </span>

                  </div>

                  <h4 className="mt-4 font-bold text-slate-800">
                    Saved Trips
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    View and manage your saved travel plans.
                  </p>
                </Link>

                {/* Settings */}
                <Link
                  to="/settings"
                  className="
                    group
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    transition-all duration-200
                    hover:-translate-y-1
                    hover:border-indigo-200
                    hover:shadow-md
                  "
                >
                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-xl">
                      ⚙️
                    </div>

                    <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">
                      →
                    </span>

                  </div>

                  <h4 className="mt-4 font-bold text-slate-800">
                    Settings
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Manage your application preferences.
                  </p>
                </Link>

              </div>
            </div>

          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Your Voyagent AI travel profile
        </p>

      </div>
    </main>
  );
}

export default Profile;