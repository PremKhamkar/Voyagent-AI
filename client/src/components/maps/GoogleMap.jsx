import { useState } from "react";

function GoogleMap({ sourceCity, destination }) {
  const [mapMode, setMapMode] = useState("destination");

  if (!destination) return null;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-amber-800">
          🗺️ Google Maps
        </h2>

        <p className="mt-2 text-sm text-amber-700">
          Google Maps API key is not configured.
        </p>
      </section>
    );
  }

  let mapUrl = "";

  if (mapMode === "destination") {
    mapUrl =
      `https://www.google.com/maps/embed/v1/search` +
      `?key=${apiKey}` +
      `&q=${encodeURIComponent(destination)}`;
  }

  if (mapMode === "route") {
    mapUrl =
      `https://www.google.com/maps/embed/v1/directions` +
      `?key=${apiKey}` +
      `&origin=${encodeURIComponent(sourceCity || "")}` +
      `&destination=${encodeURIComponent(destination)}` +
      `&mode=driving`;
  }

  if (mapMode === "attractions") {
    mapUrl =
      `https://www.google.com/maps/embed/v1/search` +
      `?key=${apiKey}` +
      `&q=${encodeURIComponent(`tourist attractions in ${destination}`)}`;
  }

  function openGoogleMaps() {
    let mapsUrl = "";

    if (mapMode === "route" && sourceCity) {
      mapsUrl =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=${encodeURIComponent(sourceCity)}` +
        `&destination=${encodeURIComponent(destination)}` +
        `&travelmode=driving`;
    } else if (mapMode === "attractions") {
      mapsUrl =
        `https://www.google.com/maps/search/?api=1` +
        `&query=${encodeURIComponent(`tourist attractions in ${destination}`)}`;
    } else {
      mapsUrl =
        `https://www.google.com/maps/search/?api=1` +
        `&query=${encodeURIComponent(destination)}`;
    }

    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xl text-white shadow-sm">
              🗺️
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Your Trip Map
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Explore your destination, route, and nearby attractions.
              </p>
            </div>
          </div>

          <button
            onClick={openGoogleMaps}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            ↗ Open in Google Maps
          </button>
        </div>
      </div>

      {/* Map Controls */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-white px-6 py-4">
        <button
          onClick={() => setMapMode("destination")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            mapMode === "destination"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          📍 Destination
        </button>

        <button
          onClick={() => setMapMode("route")}
          disabled={!sourceCity}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            mapMode === "route"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          } ${
            !sourceCity
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
        >
          🚗 Route
        </button>

        <button
          onClick={() => setMapMode("attractions")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            mapMode === "attractions"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          🏞️ Attractions
        </button>
      </div>

      {/* Map */}
      <div className="h-[320px] w-full bg-slate-100">
        <iframe
          key={mapUrl}
          title={`Google Maps - ${destination}`}
          src={mapUrl}
          className="h-full w-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      {/* Current Map Information */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              {mapMode === "destination" && `📍 ${destination}`}
              {mapMode === "route" &&
                `🚗 ${sourceCity} → ${destination}`}
              {mapMode === "attractions" &&
                `🏞️ Attractions around ${destination}`}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {mapMode === "destination" &&
                "Explore the destination and its surrounding area."}

              {mapMode === "route" &&
                "View the driving route from your starting city."}

              {mapMode === "attractions" &&
                "Discover popular places and attractions nearby."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GoogleMap;