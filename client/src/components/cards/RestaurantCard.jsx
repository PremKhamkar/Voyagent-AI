import { useState } from "react";

// Generic illustration used only when Geoapify provides no real image (or
// the image fails to load). It is deliberately an illustration, never a
// photo, so it cannot be mistaken for the actual venue.
function FallbackArt({ isCafe }) {
    return (
        <div
            role="img"
            aria-label={isCafe ? "Cafe illustration" : "Restaurant illustration"}
            className={
                isCafe
                    ? "flex h-32 w-full items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
                    : "flex h-32 w-full items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-amber-100"
            }
        >
            <svg
                width="72"
                height="72"
                viewBox="0 0 64 64"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                {isCafe ? (
                    <g stroke="#b45309">
                        <path d="M22 10c-3 3 3 5 0 8" opacity="0.55" />
                        <path d="M30 8c-3 3 3 5 0 8" opacity="0.55" />
                        <path d="M38 10c-3 3 3 5 0 8" opacity="0.55" />
                        <path d="M14 24h32v12a12 12 0 0 1-12 12h-8a12 12 0 0 1-12-12z" fill="#fff7ed" />
                        <path d="M46 28h3a6 6 0 0 1 0 12h-4" />
                        <path d="M10 54h40" />
                    </g>
                ) : (
                    <g stroke="#c2410c">
                        <circle cx="32" cy="32" r="17" fill="#fff7ed" />
                        <circle cx="32" cy="32" r="10" stroke="#fdba74" />
                        <path d="M8 12v11a4 4 0 0 0 8 0V12M12 12v40" />
                        <path d="M54 52V12c-5 3-8 9-8 17h8" />
                    </g>
                )}
            </svg>
        </div>
    );
}

function RestaurantImage({ src, name, isCafe }) {
    const [failed, setFailed] = useState(false);

    if (typeof src !== "string" || !src.trim() || failed) {
        return <FallbackArt isCafe={isCafe} />;
    }

    return (
        <img
            src={src}
            alt={`Photo of ${name}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-32 w-full object-cover"
        />
    );
}

// Builds a tel: link from the first number in a value such as
// "+91 20 1234 5678; +91 20 8765 4321".
function toTelHref(phone) {
    const first = String(phone).split(/[;,]/)[0];
    const digits = first.replace(/[^\d+]/g, "");

    return digits ? `tel:${digits}` : null;
}

function toMapsHref(place) {
    if (
        typeof place.latitude !== "number" ||
        typeof place.longitude !== "number"
    ) {
        return null;
    }

    return (
        "https://www.google.com/maps/search/?api=1&query=" +
        `${place.latitude},${place.longitude}`
    );
}

function capitalise(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function RestaurantCard({
    restaurants = [],
    isLoading = false,
    error = "",
}) {
    const hasRestaurants = restaurants && restaurants.length > 0;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-800">
                    🍽️ Restaurants &amp; Cafés
                </h2>

                {hasRestaurants && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        ✓ Verified place data
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
                            <div className="h-32 w-full animate-pulse bg-slate-200" />
                            <div className="space-y-2 p-4">
                                <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
                                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && hasRestaurants && (
                <>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {restaurants.map((place) => {
                            const telHref = place.phone ? toTelHref(place.phone) : null;
                            const mapsHref = toMapsHref(place);
                            const address = place.formatted_address || place.address;

                            return (
                                <div
                                    key={place.id || `${place.name}-${place.latitude}`}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="relative">
                                        <RestaurantImage
                                            src={place.image}
                                            name={place.name}
                                            isCafe={place.category === "Cafe"}
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

                                        {(place.cuisine?.length > 0 ||
                                            place.dietary_tags?.length > 0) && (
                                                <div className="mt-2 flex flex-wrap gap-1.5">
                                                    {(place.cuisine || []).map((item) => (
                                                        <span
                                                            key={`cuisine-${item}`}
                                                            className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
                                                        >
                                                            {item}
                                                        </span>
                                                    ))}

                                                    {(place.dietary_tags || []).map((tag) => (
                                                        <span
                                                            key={`diet-${tag}`}
                                                            className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
                                                        >
                                                            {capitalise(tag)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                        {address && (
                                            <p className="mt-2 text-xs leading-5 text-slate-500">
                                                {address}
                                            </p>
                                        )}

                                        {place.opening_hours && (
                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                <span className="font-semibold text-slate-600">
                                                    Hours:
                                                </span>{" "}
                                                {place.opening_hours}
                                            </p>
                                        )}

                                        {place.description && (
                                            <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
                                                {place.description}
                                            </p>
                                        )}

                                        {(place.website || telHref || mapsHref) && (
                                            <div className="mt-3 flex flex-wrap gap-3 text-xs">
                                                {place.website && (
                                                    <a
                                                        href={place.website}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="font-semibold text-cyan-600 hover:underline"
                                                    >
                                                        Website
                                                    </a>
                                                )}

                                                {telHref && (
                                                    <a
                                                        href={telHref}
                                                        className="font-semibold text-cyan-600 hover:underline"
                                                    >
                                                        Call
                                                    </a>
                                                )}

                                                {mapsHref && (
                                                    <a
                                                        href={mapsHref}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="font-semibold text-slate-500 hover:underline"
                                                    >
                                                        Open in Maps
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-4 text-[11px] leading-4 text-slate-400">
                        Listings come from Geoapify and OpenStreetMap contributors. Hours
                        and contact details may be incomplete or out of date, and no table
                        availability or booking is shown — please confirm with the venue.
                    </p>
                </>
            )}

            {!isLoading && !hasRestaurants && error && (
                <p className="text-sm text-amber-600">{error}</p>
            )}

            {!isLoading && !hasRestaurants && !error && (
                <p className="text-slate-500">
                    No restaurant listings were found for this destination.
                </p>
            )}
        </div>
    );
}

export default RestaurantCard;