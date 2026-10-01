function HotelCard({ hotels = [], isLoading = false, error = "" }) {
  const hasHotels = hotels.length > 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Hotels Near Destination
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Real hotel listings found near your destination
          </p>
        </div>

        {hasHotels && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Verified place data
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-slate-200"
            >
              <div className="h-36 animate-pulse bg-slate-100" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-slate-500">
          Hotel recommendations are not available right now.
        </p>
      ) : hasHotels ? (
        <div className="grid gap-5 md:grid-cols-2">
          {hotels.map((hotel) => (
            <article
              key={
                hotel.id ||
                `${hotel.name}-${hotel.latitude}-${hotel.longitude}`
              }
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
            >
              {hotel.image ? (
                <div className="relative h-40 overflow-hidden bg-slate-100">
                  <img
                    src={hotel.image}
                    alt={hotel.name || "Hotel"}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      event.currentTarget.nextElementSibling.style.display =
                        "flex";
                    }}
                  />

                  <div
                    className="absolute inset-0 hidden items-center justify-center bg-slate-50"
                    aria-hidden="true"
                  >
                    <div className="text-center">
                      <div className="text-3xl">🏨</div>
                      <p className="mt-1 text-xs text-slate-400">
                        No photo available
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                  <div className="text-center">
                    <div className="text-3xl">🏨</div>
                    <p className="mt-1 text-xs text-slate-400">
                      No photo available
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold leading-6 text-slate-800">
                      {hotel.name}
                    </h3>

                    {hotel.formatted_address && (
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                        {hotel.formatted_address}
                      </p>
                    )}
                  </div>

                  {hotel.distance_km !== undefined && (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {hotel.distance_km} km
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {hotel.website && (
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      Website
                    </a>
                  )}

                  {hotel.phone && (
                    <a
                      href={`tel:${hotel.phone}`}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      Call
                    </a>
                  )}
                </div>

                {hotel.opening_hours && (
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Hours: {hotel.opening_hours}
                  </p>
                )}

                {hotel.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {hotel.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No verified hotel listings were found near this destination.
        </p>
      )}

      <p className="mt-5 text-xs leading-5 text-slate-400">
        Hotel information comes from external place data. Room prices,
        availability, ratings, and booking status are not shown unless
        verified by a live booking source.
      </p>
    </div>
  );
}

export default HotelCard;