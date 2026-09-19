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

  if (!weather || typeof weather !== "object") {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 text-white shadow-xl">
        <div className="p-8 text-center">
          <div className="text-4xl">🌦️</div>

          <h2 className="mt-3 text-xl font-bold">
            Weather Information
          </h2>

          <p className="mt-2 text-sm text-slate-400">
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

  function toggleForecast(type, key) {
    const forecastKey = `${type}-${key}`;

    setExpandedForecast((previous) =>
      previous === forecastKey
        ? null
        : forecastKey
    );
  }

  function handleForecastKeyDown(
    event,
    type,
    key
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      toggleForecast(type, key);
    }
  }

  const hourly = Array.isArray(weather.hourly)
    ? weather.hourly.slice(0, 12)
    : [];

  const daily = Array.isArray(weather.daily)
    ? weather.daily
    : [];

  const metrics = [
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
    {
      icon: "🌧️",
      label: "Rain Chance",
      value:
        weather.rain_probability !==
        undefined
          ? `${weather.rain_probability}%`
          : "N/A",
    },
    {
      icon: "🌡️",
      label: "Feels Like",
      value:
        weather.feels_like !== undefined
          ? `${weather.feels_like}°C`
          : "N/A",
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 text-white shadow-xl">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-blue-950 to-cyan-950 px-5 py-4.5 md:px-6">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
              🌦️
            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                Live Weather
              </p>

              <h2 className="mt-0.5 text-xl font-black tracking-tight">
                Weather Information
              </h2>

              <p className="text-xs text-slate-300">
                {weather.city || "Unknown"},{" "}
                {weather.country || "Unknown"}
              </p>

            </div>

          </div>

          <span className="inline-flex w-fit items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold text-emerald-300">

            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />

            LIVE

          </span>

        </div>

      </div>

      {/* =====================================================
          CURRENT WEATHER
      ====================================================== */}

      <div className="p-4.5 md:p-6">

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-4.5 md:p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">

                {weather.weather_icon ? (
                  <img
                    src={weather.weather_icon}
                    alt={
                      weather.weather ||
                      "Weather"
                    }
                    className="h-16 w-16"
                  />
                ) : (
                  <span className="text-3xl">
                    🌦️
                  </span>
                )}

              </div>

              <div>

                <div className="flex items-start">

                  <span className="text-5xl font-black leading-none tracking-tight">
                    {weather.temperature}
                  </span>

                  <span className="ml-1 text-xl font-semibold text-cyan-300">
                    °C
                  </span>

                </div>

                <p className="mt-1 text-sm font-semibold capitalize text-slate-200">
                  {weather.weather ||
                    "Unknown"}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Feels like{" "}
                  <span className="font-semibold text-slate-200">
                    {weather.feels_like}°C
                  </span>
                </p>

              </div>

            </div>

            <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-3 sm:min-w-[160px]">

              <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-300">
                Conditions
              </p>

              <p className="mt-1 text-base font-bold text-white">
                {weather.weather_main ||
                  weather.weather ||
                  "Unavailable"}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Current observation
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            METRICS
        ================================================== */}

        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">

          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 transition hover:border-cyan-400/30 hover:bg-slate-800"
            >

              <div className="flex items-center gap-1.5">

                <span className="text-sm">
                  {metric.icon}
                </span>

                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {metric.label}
                </p>

              </div>

              <p className="mt-1.5 text-xs font-bold text-white">
                {metric.value}
              </p>

            </div>
          ))}

        </div>

        {/* =================================================
            SUNRISE / SUNSET
        ================================================== */}

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">

          <div className="flex items-center justify-between rounded-xl border border-orange-400/10 bg-orange-500/5 px-4 py-3">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-orange-300">
                🌅 Sunrise
              </p>

              <p className="mt-1 text-base font-black text-white">
                {formatTime(
                  weather.sunrise
                )}
              </p>
            </div>

            <span className="text-xl">
              🌄
            </span>

          </div>

          <div className="flex items-center justify-between rounded-xl border border-indigo-400/10 bg-indigo-500/5 px-4 py-3">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-300">
                🌇 Sunset
              </p>

              <p className="mt-1 text-base font-black text-white">
                {formatTime(
                  weather.sunset
                )}
              </p>
            </div>

            <span className="text-xl">
              🌆
            </span>

          </div>

        </div>

        {/* =================================================
            UPCOMING WEATHER
        ================================================== */}

        {hourly.length > 0 && (
          <div className="mt-6">

            <div className="mb-3 flex items-end justify-between gap-3">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Next Forecast
                </p>

                <h3 className="mt-0.5 text-lg font-black">
                  Upcoming Weather
                </h3>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Click a card for more details
                </p>
              </div>

              <span className="hidden text-[10px] font-semibold text-slate-500 sm:block">
                3-hour intervals
              </span>

            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-2">

              {hourly.map(
                (item, index) => {
                  const forecastKey =
                    `hourly-${index}`;

                  const isExpanded =
                    expandedForecast ===
                    forecastKey;

                  return (
                    <div
                      key={`${item.time}-${index}`}
                      role="button"
                      tabIndex={0}
                      aria-expanded={
                        isExpanded
                      }
                      onClick={() =>
                        toggleForecast(
                          "hourly",
                          index
                        )
                      }
                      onKeyDown={(event) =>
                        handleForecastKeyDown(
                          event,
                          "hourly",
                          index
                        )
                      }
                      className={`min-w-[150px] rounded-xl border p-3.5 outline-none transition duration-200 ${
                        isExpanded
                          ? "border-cyan-400/50 bg-slate-800 shadow-md shadow-cyan-950/30"
                          : "border-white/10 bg-slate-900 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-slate-800"
                      }`}
                    >

                      <div className="flex items-start justify-between gap-2">

                        <div>

                          <p className="text-[11px] font-bold text-cyan-300">
                            {getForecastTime(
                              item.time
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-500">
                            {getForecastDay(
                              item.time
                            )}
                          </p>

                        </div>

                        <span className="text-[10px] text-slate-500">
                          {isExpanded
                            ? "▲"
                            : "▼"}
                        </span>

                      </div>

                      {item.icon && (
                        <img
                          src={item.icon}
                          alt={
                            item.condition ||
                            "Forecast"
                          }
                          className="mt-2 h-11 w-11"
                        />
                      )}

                      <p className="mt-1 text-xl font-black">
                        {item.temperature}°
                      </p>

                      <p className="mt-0.5 min-h-[30px] text-[11px] font-semibold capitalize text-slate-300">
                        {item.condition ||
                          "Unknown"}
                      </p>

                      <div className="mt-2 border-t border-white/10 pt-2 text-[10px] text-slate-400">

                        <div className="flex justify-between gap-2">

                          <span>
                            🌧️{" "}
                            {item.rain_probability}%
                          </span>

                          <span>
                            💨{" "}
                            {item.wind_speed} m/s
                          </span>

                        </div>

                      </div>

                      {isExpanded && (
                        <div className="mt-3 border-t border-cyan-400/20 pt-3">

                          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-cyan-300">
                            Forecast Details
                          </p>

                          <div className="space-y-1.5 text-[10px]">

                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">
                                Feels like
                              </span>

                              <span className="font-semibold text-white">
                                {item.feels_like}°C
                              </span>
                            </div>

                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">
                                Humidity
                              </span>

                              <span className="font-semibold text-white">
                                {item.humidity}%
                              </span>
                            </div>

                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">
                                Cloud cover
                              </span>

                              <span className="font-semibold text-white">
                                {item.clouds}%
                              </span>
                            </div>

                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">
                                Rain chance
                              </span>

                              <span className="font-semibold text-cyan-300">
                                {item.rain_probability}%
                              </span>
                            </div>

                          </div>

                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>

          </div>
        )}

        {/* =================================================
            MULTI-DAY FORECAST
        ================================================== */}

        {daily.length > 0 && (
          <div className="mt-6">

            <div className="mb-3">

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                Extended Forecast
              </p>

              <h3 className="mt-0.5 text-lg font-black">
                Multi-Day Forecast
              </h3>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Click a day for more details
              </p>

            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-2">

              {daily.map(
                (day, index) => {
                  const forecastKey =
                    `daily-${index}`;

                  const isExpanded =
                    expandedForecast ===
                    forecastKey;

                  return (
                    <div
                      key={day.date}
                      role="button"
                      tabIndex={0}
                      aria-expanded={
                        isExpanded
                      }
                      onClick={() =>
                        toggleForecast(
                          "daily",
                          index
                        )
                      }
                      onKeyDown={(event) =>
                        handleForecastKeyDown(
                          event,
                          "daily",
                          index
                        )
                      }
                      className={`min-w-[210px] rounded-xl border p-4 outline-none transition duration-200 ${
                        isExpanded
                          ? "border-indigo-400/50 bg-slate-800 shadow-md shadow-indigo-950/30"
                          : "border-white/10 bg-slate-900 hover:border-indigo-400/30 hover:bg-slate-800"
                      }`}
                    >

                      <div className="flex items-start justify-between gap-2">

                        <div>

                          <p className="text-sm font-black text-white">
                            {getDayLabel(
                              day.date,
                              index
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-500">
                            {day.date}
                          </p>

                        </div>

                        <div className="flex items-center gap-1">

                          {day.icon && (
                            <img
                              src={day.icon}
                              alt={
                                day.condition ||
                                "Forecast"
                              }
                              className="h-10 w-10"
                            />
                          )}

                          <span className="text-[10px] text-slate-500">
                            {isExpanded
                              ? "▲"
                              : "▼"}
                          </span>

                        </div>

                      </div>

                      <p className="mt-2 text-xs font-semibold capitalize text-slate-300">
                        {day.condition ||
                          "Unknown"}
                      </p>

                      <div className="mt-2 flex items-end gap-2">

                        <span className="text-2xl font-black">
                          {day.max_temperature}°
                        </span>

                        <span className="pb-0.5 text-xs font-semibold text-slate-500">
                          {day.min_temperature}°
                        </span>

                      </div>

                      <div className="mt-2.5 grid grid-cols-2 gap-2">

                        <div className="rounded-lg bg-slate-800 px-2.5 py-2">

                          <p className="text-[9px] uppercase tracking-wide text-slate-500">
                            Rain
                          </p>

                          <p className="mt-0.5 text-[10px] font-bold text-white">
                            🌧️{" "}
                            {day.rain_probability}%
                          </p>

                        </div>

                        <div className="rounded-lg bg-slate-800 px-2.5 py-2">

                          <p className="text-[9px] uppercase tracking-wide text-slate-500">
                            Humidity
                          </p>

                          <p className="mt-0.5 text-[10px] font-bold text-white">
                            💧{" "}
                            {day.humidity}%
                          </p>

                        </div>

                      </div>

                      {isExpanded && (
                        <div className="mt-3 border-t border-indigo-400/20 pt-3">

                          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-indigo-300">
                            Day Details
                          </p>

                          <div className="space-y-1.5 text-[10px]">

                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">
                                High
                              </span>

                              <span className="font-semibold text-white">
                                {day.max_temperature}°C
                              </span>
                            </div>

                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">
                                Low
                              </span>

                              <span className="font-semibold text-white">
                                {day.min_temperature}°C
                              </span>
                            </div>

                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">
                                Rain chance
                              </span>

                              <span className="font-semibold text-cyan-300">
                                {day.rain_probability}%
                              </span>
                            </div>

                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">
                                Humidity
                              </span>

                              <span className="font-semibold text-white">
                                {day.humidity}%
                              </span>
                            </div>

                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">
                                Condition
                              </span>

                              <span className="max-w-[120px] text-right font-semibold capitalize text-white">
                                {day.condition ||
                                  "Unknown"}
                              </span>
                            </div>

                          </div>

                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="border-t border-white/10 bg-black/20 px-5 py-3 md:px-6">

        <div className="flex flex-col gap-1 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <span>
            Weather provided by OpenWeather
          </span>

          {weather.last_updated && (
            <span>
              Weather data:{" "}
              {formatDateTime(
                weather.last_updated
              )}
            </span>
          )}

        </div>

      </div>

    </div>
  );
}

export default WeatherCard;