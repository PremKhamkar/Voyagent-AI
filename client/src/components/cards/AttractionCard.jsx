import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function AttractionImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-3xl">
        📍
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-40 w-full object-cover"
    />
  );
}

function AttractionCard({
  attractions = [],
  isLoading = false,
  error = "",
  content = "",
}) {
  const hasRealAttractions = attractions && attractions.length > 0;
  const hasFallbackText = content && content.trim();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          📍 Tourist Attractions
        </h2>

        {hasRealAttractions && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            ✓ Verified places
          </span>
        )}
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-slate-200"
            >
              <div className="h-40 w-full animate-pulse bg-slate-200" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && hasRealAttractions && (
        <div className="grid gap-4 sm:grid-cols-2">
          {attractions.map((place) => (
            <div
              key={place.id || place.name}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative">
                <AttractionImage
                  src={place.image_url}
                  alt={place.name}
                />

                {place.category && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
                    {place.category}
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    {place.name}
                  </h3>

                  {typeof place.distance_km === "number" && (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
                      {place.distance_km} km
                    </span>
                  )}
                </div>

                {place.description && (
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
                    {place.description}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  {place.website ? (
                    <a href={place.website} target="_blank" rel="noreferrer" className="font-semibold text-cyan-600 hover:underline">
                      Website
                    </a>
                  ) : null}

                  {place.wikipedia_url ? (
                    <a href={place.wikipedia_url} target="_blank" rel="noreferrer" className="font-semibold text-slate-500 hover:underline">
                      Wikipedia
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !hasRealAttractions && hasFallbackText && (
        <div>
          {error && (
            <p className="mb-3 text-xs text-amber-600">
              Showing AI-suggested attractions - verified place data
              was not available for this destination.
            </p>
          )}

          <div className="prose max-w-none prose-p:text-slate-600 prose-strong:text-slate-800 prose-li:text-slate-600 prose-headings:text-slate-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {!isLoading && !hasRealAttractions && !hasFallbackText && (
        <p className="text-slate-500">
          {error || "Attractions will appear here."}
        </p>
      )}
    </div>
  );
}

export default AttractionCard;