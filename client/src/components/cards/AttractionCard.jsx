import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_BASE_URL = "http://127.0.0.1:8000";

function formatDistance(distance) {
  const value = Number(distance);

  if (!Number.isFinite(value)) {
    return "Nearby";
  }

  if (value < 1) {
    return `${Math.round(value * 1000)} m away`;
  }

  return `${value.toFixed(1)} km away`;
}

function getMapsUrl(attraction) {
  if (
    Number.isFinite(Number(attraction?.latitude)) &&
    Number.isFinite(Number(attraction?.longitude))
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${attraction.latitude},${attraction.longitude}`
    )}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    attraction?.formatted_address || attraction?.name || ""
  )}`;
}

function getCategoryLabel(attraction) {
  const category = attraction?.category?.trim();

  if (!category) {
    return "Attraction";
  }

  return category
    .replace(/\./g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function AttractionCard({ content = "", destination = "" }) {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAttractions() {
      if (!destination?.trim()) {
        setAttractions([]);
        setError("");
        setExpandedId(null);
        return;
      }

      setLoading(true);
      setError("");
      setExpandedId(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/attractions?destination=${encodeURIComponent(
            destination.trim()
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail || "Unable to load tourist attractions."
          );
        }

        const nextAttractions = Array.isArray(data?.attractions)
          ? data.attractions
          : [];

        // Only show attractions with a backend-verified image.
        // Never invent, search broadly, or use a generic image fallback.
        const imageReadyAttractions = nextAttractions
          .filter(
            (attraction) =>
              typeof attraction?.image_url === "string" &&
              attraction.image_url.trim().length > 0
          )
          .slice(0, 8);

        if (!cancelled) {
          setAttractions(imageReadyAttractions);
          setExpandedId(
            imageReadyAttractions[0]?.id ||
              imageReadyAttractions[0]?.name ||
              null
          );
        }
      } catch (requestError) {
        console.error("Attractions fetch error:", requestError);

        if (!cancelled) {
          setAttractions([]);
          setExpandedId(null);
          setError(
            requestError?.message ||
              "Unable to load tourist attractions right now."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAttractions();

    return () => {
      cancelled = true;
    };
  }, [destination]);

  const hasFallbackContent = useMemo(() => {
    return typeof content === "string" && content.trim().length > 0;
  }, [content]);

  function toggleDetails(attractionId) {
    setExpandedId((currentId) =>
      currentId === attractionId ? null : attractionId
    );
  }

  function removeBrokenImage(attractionId) {
    setAttractions((current) => {
      const remaining = current.filter((item, index) => {
        const itemId = item?.id || `${item?.name || "attraction"}-${index}`;
        return itemId !== attractionId;
      });

      if (remaining.length > 0) {
        setExpandedId((currentId) => {
          if (currentId !== attractionId) return currentId;

          return remaining[0]?.id || remaining[0]?.name || null;
        });
      } else {
        setExpandedId(null);
      }

      return remaining;
    });
  }

  return (
    <section className="w-full min-w-0 max-w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl">
              📍
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Tourist Attractions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Real places with verified photos near {destination || "your destination"}
              </p>
            </div>
          </div>
        </div>

        {!loading && attractions.length > 0 ? (
          <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {attractions.length} photo-ready places
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="h-[250px] animate-pulse bg-slate-200" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="h-10 w-full animate-pulse rounded-2xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : attractions.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {attractions.map((attraction, index) => {
            const attractionId =
              attraction?.id || `${attraction?.name || "attraction"}-${index}`;
            const isExpanded = expandedId === attractionId;
            const category = getCategoryLabel(attraction);
            const description =
              attraction?.description?.trim() ||
              `${attraction?.name || "This attraction"} is a place to explore in ${destination}.`;

            return (
              <article
                key={attractionId}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,0.13)]"
              >
                <div className="relative h-[250px] overflow-hidden bg-slate-100">
                  <img
                    src={attraction.image_url}
                    alt={attraction.name || "Tourist attraction"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    onError={() => removeBrokenImage(attractionId)}
                  />

                  <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/85 px-3.5 py-1.5 text-sm font-semibold text-white shadow-lg backdrop-blur">
                    {category}
                  </div>

                  <div className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/95 px-3.5 py-1.5 text-sm font-semibold text-slate-800 shadow-md">
                    {formatDistance(attraction.distance_km)}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-bold leading-tight text-slate-900">
                    {attraction.name || "Unnamed attraction"}
                  </h3>

                  <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-500">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-rose-500"
                    >
                      📍
                    </span>
                    <span>
                      {attraction.formatted_address ||
                        attraction.address ||
                        `Near ${destination}`}
                    </span>
                  </div>

                  <div className="my-5 h-px bg-slate-200" />

                  <div
                    className={`overflow-hidden text-[15px] leading-7 text-slate-600 transition-[max-height,opacity] duration-300 ${
                      isExpanded
                        ? "max-h-80 opacity-100"
                        : "max-h-20 opacity-90"
                    }`}
                  >
                    <p>{description}</p>

                    {isExpanded && attraction.opening_hours ? (
                      <p className="mt-3 text-sm font-medium text-slate-500">
                        Hours: {attraction.opening_hours}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <a
                      href={getMapsUrl(attraction)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 items-center justify-center rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      🗺️&nbsp; Open Maps
                    </a>

                    {attraction.website ? (
                      <a
                        href={attraction.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        🌐&nbsp; Website
                      </a>
                    ) : null}

                    {attraction.wikipedia_url ? (
                      <a
                        href={attraction.wikipedia_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        ℹ️&nbsp; Details
                      </a>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleDetails(attractionId)}
                    className="mt-4 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    <span>
                      {isExpanded ? "Hide details" : "Show details"}
                    </span>
                    <span className="text-lg leading-none" aria-hidden="true">
                      {isExpanded ? "↑" : "↓"}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold text-amber-900">
            Tourist attractions could not be loaded right now.
          </p>
          <p className="mt-1 text-sm text-amber-800">
            The AI destination notes are still available below.
          </p>
          {hasFallbackContent ? (
            <div className="prose prose-slate mt-5 max-w-none text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
          <div className="text-3xl">🖼️</div>
          <p className="mt-2 font-semibold text-slate-800">
            No attractions with verified photos were found.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            We only display places when a verified image is available, so the
            attraction gallery never shows unrelated or placeholder photos.
          </p>
          {hasFallbackContent ? (
            <div className="prose prose-slate mx-auto mt-5 max-w-3xl text-left text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

export default AttractionCard;
