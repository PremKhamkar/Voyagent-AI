import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import WeatherCard from "../../components/cards/WeatherCard";

const API_BASE = "http://127.0.0.1:8000";

function SavedTripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [weatherFetchedAt, setWeatherFetchedAt] =
    useState(null);

  const userEmail =
    localStorage.getItem("userEmail") || "";

  // ============================================================
  // Load Saved Trip
  // ============================================================

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

  // ============================================================
  // Fetch Live Weather
  // ============================================================

  async function fetchLiveWeather(destination) {
    if (!destination?.trim()) {
      return;
    }

    setWeatherLoading(true);
    setWeatherError("");

    try {
      const response = await fetch(
        `${API_BASE}/weather?destination=${encodeURIComponent(
          destination.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Unable to fetch live weather."
        );
      }

      if (!data.weather) {
        throw new Error(
          "Weather data was not returned."
        );
      }

      setWeather(data.weather);
      setWeatherFetchedAt(new Date());
    } catch (error) {
      console.error(
        "LIVE WEATHER ERROR:",
        error
      );

      setWeatherError(
        error.message ||
        "Unable to load live weather."
      );
    } finally {
      setWeatherLoading(false);
    }
  }

  // ============================================================
  // Load Live Weather When Trip Opens
  // ============================================================

  useEffect(() => {
    if (!trip?.destination) {
      return;
    }

    fetchLiveWeather(trip.destination);
  }, [trip?.destination]);

  // ============================================================
  // Date Helpers
  // ============================================================

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

  function formatShortDate(date) {
    if (!date) return "";

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

    return `${difference} ${difference === 1 ? "Day" : "Days"
      }`;
  }

  // ============================================================
  // Filter Forecast To Saved Trip Dates
  // ============================================================

  function getTripForecast(weatherData) {
    if (
      !weatherData?.daily ||
      !trip?.startDate ||
      !trip?.endDate
    ) {
      return [];
    }

    return weatherData.daily.filter(
      (day) =>
        day.date >= trip.startDate &&
        day.date <= trip.endDate
    );
  }

  // ============================================================
  // Delete Trip
  // ============================================================

  function handleDeleteTrip() {
    if (!trip || !userEmail) return;

    const storageKey =
      `voyagent_saved_trips_${userEmail}`;

    const savedTrips = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    const updatedTrips =
      savedTrips.filter(
        (savedTrip) =>
          savedTrip.id !== trip.id
      );

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedTrips)
    );

    navigate("/saved-trips", {
      replace: true,
    });
  }

  // ============================================================
  // Trip Not Found
  // ============================================================

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
              This saved trip may have been
              deleted or is no longer available.
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

  const tripForecast =
    getTripForecast(weather);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* ======================================================
            Back Navigation
        ====================================================== */}

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

        {/* ======================================================
            Hero
        ====================================================== */}

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

        {/* ======================================================
            Preferences
        ====================================================== */}

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

        {/* ======================================================
            AI Itinerary
        ====================================================== */}

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

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >
                {trip.itinerary}
              </ReactMarkdown>

            </div>
          ) : (
            <p className="text-slate-500">
              No itinerary information was saved.
            </p>
          )}

        </section>

        {/* ======================================================
            LIVE WEATHER
        ====================================================== */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-xl">
                🌦️
              </div>

              <div>

                <h2 className="text-2xl font-black text-slate-900">
                  Live Weather
                </h2>

                <p className="text-sm text-slate-500">
                  Current weather and forecast for{" "}
                  {trip.destination}
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                fetchLiveWeather(
                  trip.destination
                )
              }
              disabled={weatherLoading}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {weatherLoading
                ? "Refreshing..."
                : "↻ Refresh Weather"}
            </button>

          </div>

          {/* Loading */}

          {weatherLoading && !weather && (
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-8 text-center">

              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />

              <p className="font-semibold text-sky-800">
                Loading live weather...
              </p>

              <p className="mt-1 text-sm text-sky-600">
                Fetching the latest conditions
                for {trip.destination}.
              </p>

            </div>
          )}

          {/* Error */}

          {weatherError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

              <p className="font-semibold text-red-700">
                ⚠️ Weather unavailable
              </p>

              <p className="mt-1 text-sm text-red-600">
                {weatherError}
              </p>

              <button
                type="button"
                onClick={() =>
                  fetchLiveWeather(
                    trip.destination
                  )
                }
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>

            </div>
          )}

          {/* Live Weather Data */}

          {weather && !weatherError && (
            <>

              <div className="mb-5 flex flex-wrap items-center gap-3">

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  ● LIVE
                </span>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">

                  {weather.last_updated && (
                    <span>
                      Weather data:{" "}
                      {new Date(
                        weather.last_updated
                      ).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  )}

                  {weatherFetchedAt && (
                    <>
                      <span className="text-slate-300">
                        •
                      </span>

                      <span>
                        Refreshed:{" "}
                        {weatherFetchedAt.toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </>
                  )}

                </div>

              </div>

              <WeatherCard
                content={weather}
              />

            </>
          )}

        </section>

        {/* ======================================================
            TRIP FORECAST
        ====================================================== */}

        {weather && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

            {/* Header */}

            <div className="flex items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                📅
              </div>

              <div>

                <h2 className="text-2xl font-black text-slate-900">
                  Trip Forecast
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Forecast availability for your
                  selected travel dates
                </p>

              </div>

            </div>

            {/* Trip Dates */}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Your trip
                  </p>

                  <p className="mt-1 text-lg font-black text-slate-800">
                    {formatShortDate(
                      trip.startDate
                    )}{" "}
                    <span className="font-medium text-slate-400">
                      →
                    </span>{" "}
                    {formatShortDate(
                      trip.endDate
                    )}
                  </p>

                </div>

                <div className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                  {getTripDuration(
                    trip.startDate,
                    trip.endDate
                  )}
                </div>

              </div>

              {/* Date Timeline */}

              <div className="mt-5 flex items-center">

                <div className="h-3 w-3 rounded-full bg-cyan-500 ring-4 ring-cyan-100" />

                <div className="h-px flex-1 bg-slate-300" />

                <div className="h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-indigo-100" />

              </div>

              <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-400">

                <span>
                  {formatShortDate(
                    trip.startDate
                  )}
                </span>

                <span>
                  {formatShortDate(
                    trip.endDate
                  )}
                </span>

              </div>

            </div>

            {/* Available Forecast */}

            {tripForecast.length > 0 ? (

              <div className="mt-5">

                <div className="mb-4 flex items-center justify-between">

                  <div>

                    <h3 className="text-lg font-black text-slate-900">
                      Forecast During Your Trip
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Available forecast data for
                      the selected dates
                    </p>

                  </div>

                  <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:block">
                    {tripForecast.length}{" "}
                    {tripForecast.length === 1
                      ? "day"
                      : "days"}{" "}
                    available
                  </span>

                </div>

                <div className="flex gap-3 overflow-x-auto pb-2">

                  {tripForecast.map(
                    (day) => (
                      <div
                        key={day.date}
                        className="min-w-[210px] rounded-2xl border border-slate-200 bg-slate-50 p-5"
                      >

                        <div className="flex items-start justify-between">

                          <div>

                            <p className="text-sm font-black text-slate-800">
                              {new Date(
                                `${day.date}T12:00:00`
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  weekday:
                                    "short",
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                              {day.date}
                            </p>

                          </div>

                          {day.icon && (
                            <img
                              src={day.icon}
                              alt={
                                day.condition ||
                                "Forecast"
                              }
                              className="h-12 w-12"
                            />
                          )}

                        </div>

                        <p className="mt-3 text-sm font-semibold capitalize text-slate-700">
                          {day.condition ||
                            "Unknown"}
                        </p>

                        <div className="mt-3 flex items-end gap-3">

                          <span className="text-3xl font-black text-slate-900">
                            {day.max_temperature}°
                          </span>

                          <span className="pb-1 text-sm font-semibold text-slate-400">
                            {day.min_temperature}°
                          </span>

                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">

                          <div className="rounded-xl bg-white px-3 py-2">

                            <p className="text-[10px] uppercase tracking-wide text-slate-400">
                              Rain
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-700">
                              🌧️{" "}
                              {day.rain_probability}%
                            </p>

                          </div>

                          <div className="rounded-xl bg-white px-3 py-2">

                            <p className="text-[10px] uppercase tracking-wide text-slate-400">
                              Humidity
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-700">
                              💧{" "}
                              {day.humidity}%
                            </p>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>

            ) : (

              /* =================================================
                 UNAVAILABLE FORECAST STATE
              ================================================== */

              <div className="mt-5 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    📅
                  </div>

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="text-base font-black text-amber-900">
                        Trip-date forecast not
                        available yet
                      </h3>

                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 shadow-sm">
                        Waiting for forecast window
                      </span>

                    </div>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-800/80">
                      Weather forecasts for{" "}
                      <span className="font-semibold">
                        {formatShortDate(
                          trip.startDate
                        )}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold">
                        {formatShortDate(
                          trip.endDate
                        )}
                      </span>{" "}
                      are not available yet.
                    </p>

                  </div>

                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">

                  <div className="rounded-xl border border-amber-200/70 bg-white/70 p-3.5">

                    <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600">
                      Trip dates
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {formatShortDate(
                        trip.startDate
                      )}{" "}
                      →{" "}
                      {formatShortDate(
                        trip.endDate
                      )}
                    </p>

                  </div>

                  <div className="rounded-xl border border-amber-200/70 bg-white/70 p-3.5">

                    <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600">
                      Current status
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      Forecast not in range
                    </p>

                  </div>

                  <div className="rounded-xl border border-amber-200/70 bg-white/70 p-3.5">

                    <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600">
                      Live weather
                    </p>

                    <p className="mt-1 text-sm font-bold text-emerald-700">
                      ● Available above
                    </p>

                  </div>

                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200/70 bg-white/50 px-4 py-3">

                  <span className="text-sm">
                    🔄
                  </span>

                  <p className="text-xs font-medium leading-5 text-amber-800/80">
                    🔄 Forecast information will appear here when your selected dates enter the available forecast window. Reopen or refresh the trip to check for updated forecast data.
                  </p>

                </div>

              </div>
            )}

          </section>
        )}

        {/* ======================================================
            INFORMATION GRID
        ====================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

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

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                >
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

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                >
                  {trip.destinationPlan}
                </ReactMarkdown>

              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No destination information
                was saved.
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

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                >
                  {trip.accommodationPlan}
                </ReactMarkdown>

              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No accommodation information
                was saved.
              </p>
            )}

          </section>

        </div>

        {/* ======================================================
            Bottom CTA
        ====================================================== */}

        <section className="mt-8 rounded-3xl bg-slate-900 p-8 text-center text-white">

          <h2 className="text-2xl font-black">
            Ready for another adventure?
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm text-white/60">
            Create a new personalized itinerary
            with Voyagent AI.
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