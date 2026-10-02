import { useState } from "react";

function WeatherCard({ content }) {
  let weather = content;

  if (typeof weather === "string") {
    try {
      weather = JSON.parse(weather);
    } catch {
      weather = null;
    }
  }

  const [expandedForecast, setExpandedForecast] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  if (!weather || typeof weather !== "object") {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-sm">
        <div className="p-8 text-center">
          <div className="text-4xl">🌦️</div>

          <h2 className="mt-3 text-xl font-bold">
            Weather Information
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Weather information will appear here.
          </p>
        </div>
      </div>
    );
  }

  function formatTime(timestamp) {
    if (!timestamp) return "N/A";

    return new Date(
      timestamp * 1000
    ).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatDateTime(timestamp) {
    if (!timestamp) return "N/A";

    return new Date(timestamp).toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  function getWindDirection(degrees) {
    if (
      degrees === "N/A" ||
      degrees === null ||
      degrees === undefined ||
      Number.isNaN(Number(degrees))
    ) {
      return "N/A";
    }

    const directions = [
      "N",
      "NE",
      "E",
      "SE",
      "S",
      "SW",
      "W",
      "NW",
    ];

    const index =
      Math.round(Number(degrees) / 45) % 8;

    return `${directions[index]} (${degrees}°)`;
  }

  function getForecastTime(time) {
    if (!time) return "";

    return new Date(time).toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  function getForecastDay(time) {
    if (!time) return "";

    return new Date(time).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
      }
    );
  }

  function getDayLabel(date, index) {
    if (!date) return "";

    const today =
      new Date().toISOString().split("T")[0];

    const tomorrow =
      new Date(
        Date.now() + 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];

    if (date === today) return "Today";
    if (date === tomorrow) return "Tomorrow";

    const parsedDate = new Date(
      `${date}T12:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return `Day ${index + 1}`;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
      }
    );
  }

  // One forecast detail (daily OR hourly) is open at a time.
  function toggleForecast(type, key) {
    const forecastKey = `${type}-${key}`;

    setExpandedForecast((previous) =>
      previous === forecastKey
        ? null
        : forecastKey
    );
  }

  function toggleDetails() {
    // Closing the section also closes any open hourly detail.
    if (
      showDetails &&
      typeof expandedForecast === "string" &&
      expandedForecast.startsWith("hourly-")
    ) {
      setExpandedForecast(null);
    }

    setShowDetails((previous) => !previous);
  }

  // Only claim LIVE when the backend actually returned an observation.
  const isLive =
    weather.weather_main !== "Unavailable" &&
    Boolean(weather.last_updated);

  const hourly = Array.isArray(weather.hourly)
    ? weather.hourly.slice(0, 12)
    : [];

  const daily = Array.isArray(weather.daily)
    ? weather.daily
    : [];

  const location = [
    weather.city || "Unknown",
    weather.country && weather.country !== "Unknown"
      ? weather.country
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  // Shown in the primary summary.
  const summaryStats = [
    {
      icon: "💧",
      label: "Humidity",
      value:
        weather.humidity !== undefined
          ? `${weather.humidity}%`
          : "N/A",
    },
    {
      icon: "💨",
      label: "Wind",
      value:
        weather.wind_speed !== undefined
          ? `${weather.wind_speed} m/s`
          : "N/A",
    },
    {
      icon: "🌧️",
      label: "Rain",
      value:
        weather.rain_probability !==
        undefined
          ? `${weather.rain_probability}%`
          : "N/A",
    },
  ];

  // Shown only inside "Hourly forecast & more details".
  const detailMetrics = [
    {
      icon: "🧭",
      label: "Direction",
      value: getWindDirection(
        weather.wind_direction
      ),
    },
    {
      icon: "🧭",
      label: "Pressure",
      value:
        weather.pressure !== undefined
          ? `${weather.pressure} hPa`
          : "N/A",
    },
    {
      icon: "👁️",
      label: "Visibility",
      value:
        weather.visibility !== undefined
          ? `${weather.visibility} km`
          : "N/A",
    },
    {
      icon: "☁️",
      label: "Cloud Cover",
      value:
        weather.clouds !== undefined
          ? `${weather.clouds}%`
          : "N/A",
    },
  ];

  const expandedDay = daily.find(
    (day, index) =>
      expandedForecast === `daily-${index}`
  );

  const expandedHour = hourly.find(
    (item, index) =>
      expandedForecast === `hourly-${index}`
  );

  const chipClass = (isExpanded) =>
    `shrink-0 rounded-xl border px-3 py-2.5 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
      isExpanded
        ? "border-cyan-400 bg-white shadow-sm"
        : "border-slate-200 bg-slate-50 hover:border-cyan-300 hover:bg-white"
    }`;

  return (
    <div
      role="region"
      aria-label="Weather information"
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-sm"
    >
      {/* Top row: location + live state */}

      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-5 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
            🌦️
          </div>

          <h2 className="truncate text-lg font-bold text-slate-800">
            {location}
          </h2>
        </div>

        <span
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-[11px] font-bold ${
            isLive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <span
            className={`mr-2 h-1.5 w-1.5 rounded-full ${
              isLive ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />

          {isLive ? "LIVE" : "UNAVAILABLE"}
        </span>
      </div>

      <div className="px-5 py-4 md:px-6">

        {!isLive && (
          <p className="text-sm text-slate-600">
            Weather data is unavailable right now.
          </p>
        )}

        {/* Primary summary */}

        {isLive && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                {weather.weather_icon ? (
                  <img
                    src={weather.weather_icon}
                    alt=""
                    className="h-12 w-12"
                  />
                ) : (
                  <span className="text-2xl">🌦️</span>
                )}
              </div>

              <div>
                <div className="flex items-start">
                  <span className="text-4xl font-black leading-none tracking-tight">
                    {weather.temperature}
                  </span>

                  <span className="ml-1 text-lg font-semibold text-cyan-700">
                    °C
                  </span>
                </div>

                <p className="mt-1 text-sm font-semibold capitalize text-slate-700">
                  {weather.weather || "Unknown"}
                  <span className="font-normal text-slate-600">
                    {" "}
                    · Feels like {weather.feels_like}°C
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:w-72">
              {summaryStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    <span aria-hidden="true">{stat.icon}</span>{" "}
                    {stat.label}
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily forecast (visible by default) */}

        {daily.length > 0 && (
          <div className={isLive ? "mt-4" : "mt-3"}>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {daily.map((day, index) => {
                const isExpanded =
                  expandedForecast === `daily-${index}`;

                return (
                  <button
                    key={day.date}
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls="weather-daily-details"
                    onClick={() =>
                      toggleForecast("daily", index)
                    }
                    className={`${chipClass(isExpanded)} min-w-[96px]`}
                  >
                    <span className="block text-xs font-bold text-slate-800">
                      {getDayLabel(day.date, index)}
                    </span>

                    <span className="mt-1 flex items-center gap-1">
                      {day.icon && (
                        <img
                          src={day.icon}
                          alt={day.condition || ""}
                          className="h-8 w-8"
                        />
                      )}

                      <span className="text-sm font-black text-slate-900">
                        {day.max_temperature}°
                      </span>

                      <span className="text-xs font-semibold text-slate-600">
                        {day.min_temperature}°
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {expandedDay && (
              <dl
                id="weather-daily-details"
                className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl border border-cyan-100 bg-cyan-50/50 px-4 py-3 text-xs sm:grid-cols-3"
              >
                <div>
                  <dt className="text-slate-600">Rain chance</dt>
                  <dd className="font-semibold text-slate-900">
                    {expandedDay.rain_probability}%
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-600">Humidity</dt>
                  <dd className="font-semibold text-slate-900">
                    {expandedDay.humidity}%
                  </dd>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-slate-600">Condition</dt>
                  <dd className="font-semibold capitalize text-slate-900">
                    {expandedDay.condition || "Unknown"}
                  </dd>
                </div>
              </dl>
            )}
          </div>
        )}

        {/* Hourly + advanced details (collapsed by default) */}

        {isLive && (
          <div className="mt-4">
            <button
              type="button"
              aria-expanded={showDetails}
              aria-controls="weather-more-details"
              onClick={toggleDetails}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            >
              Hourly forecast &amp; more details

              <span
                aria-hidden="true"
                className={`text-xs transition-transform ${
                  showDetails ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {showDetails && (
              <div
                id="weather-more-details"
                className="mt-3 space-y-4"
              >
                {hourly.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-cyan-700">
                      Hourly forecast · 3-hour intervals
                    </p>

                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {hourly.map((item, index) => {
                        const isExpanded =
                          expandedForecast === `hourly-${index}`;

                        return (
                          <button
                            key={`${item.time}-${index}`}
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls="weather-hourly-details"
                            onClick={() =>
                              toggleForecast("hourly", index)
                            }
                            className={`${chipClass(isExpanded)} min-w-[104px]`}
                          >
                            <span className="block text-xs font-bold text-cyan-700">
                              {getForecastTime(item.time)}
                            </span>

                            <span className="block text-[11px] text-slate-600">
                              {getForecastDay(item.time)}
                            </span>

                            <span className="mt-1 flex items-center gap-1">
                              {item.icon && (
                                <img
                                  src={item.icon}
                                  alt={item.condition || ""}
                                  className="h-8 w-8"
                                />
                              )}

                              <span className="text-sm font-black text-slate-900">
                                {item.temperature}°
                              </span>
                            </span>

                            <span className="mt-0.5 block text-[11px] text-slate-600">
                              <span aria-hidden="true">🌧️</span>{" "}
                              {item.rain_probability}%
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {expandedHour && (
                      <dl
                        id="weather-hourly-details"
                        className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl border border-cyan-100 bg-cyan-50/50 px-4 py-3 text-xs sm:grid-cols-4"
                      >
                        <div>
                          <dt className="text-slate-600">Feels like</dt>
                          <dd className="font-semibold text-slate-900">
                            {expandedHour.feels_like}°C
                          </dd>
                        </div>

                        <div>
                          <dt className="text-slate-600">Humidity</dt>
                          <dd className="font-semibold text-slate-900">
                            {expandedHour.humidity}%
                          </dd>
                        </div>

                        <div>
                          <dt className="text-slate-600">Cloud cover</dt>
                          <dd className="font-semibold text-slate-900">
                            {expandedHour.clouds}%
                          </dd>
                        </div>

                        <div>
                          <dt className="text-slate-600">Rain chance</dt>
                          <dd className="font-semibold text-slate-900">
                            {expandedHour.rain_probability}%
                          </dd>
                        </div>
                      </dl>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {detailMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                        <span aria-hidden="true">{metric.icon}</span>{" "}
                        {metric.label}
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-900">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-orange-700">
                      <span aria-hidden="true">🌅</span> Sunrise
                    </p>

                    <p className="mt-1 text-base font-black text-slate-900">
                      {formatTime(weather.sunrise)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-700">
                      <span aria-hidden="true">🌇</span> Sunset
                    </p>

                    <p className="mt-1 text-base font-black text-slate-900">
                      {formatTime(weather.sunset)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}

      <div className="flex flex-col gap-0.5 border-t border-slate-200 bg-slate-50 px-5 py-2.5 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <span>Weather provided by OpenWeather</span>

        {weather.last_updated && (
          <span>
            Weather data: {formatDateTime(weather.last_updated)}
          </span>
        )}
      </div>
    </div>
  );
}

export default WeatherCard;
