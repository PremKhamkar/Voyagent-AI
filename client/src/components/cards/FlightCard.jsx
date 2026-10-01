function AirportBlock({ label, city, airport }) {
  if (!airport) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Airport information could not be resolved.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            {airport.name}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {city}
          </p>
        </div>

        {airport.iata && (
          <span className="shrink-0 rounded-lg bg-cyan-100 px-2.5 py-1 text-sm font-bold text-cyan-700">
            {airport.iata}
          </span>
        )}
      </div>

      {airport.icao && (
        <p className="mt-2 text-xs text-slate-500">
          ICAO: {airport.icao}
        </p>
      )}
    </div>
  );
}

function FlightCard({
  flights = [],
  route = null,
  provider = null,
  isLoading = false,
  error = "",
}) {
  if (isLoading) {
    return (
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-200 border-t-cyan-600" />

          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Flight Information
            </h3>

            <p className="text-sm text-slate-500">
              Looking up airport and route information...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="text-lg font-bold text-slate-800">
          Flight Information
        </h3>

        <p className="mt-2 text-sm text-amber-800">
          {error}
        </p>
      </section>
    );
  }

  const origin = route?.origin;
  const destination = route?.destination;

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Flight Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Verified airport and route information for your trip.
          </p>
        </div>

        <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Verified route data
        </span>
      </div>

      {route ? (
        <>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <AirportBlock
              label="Departure"
              city={origin?.city}
              airport={origin?.primary_airport}
            />

            <AirportBlock
              label="Arrival"
              city={destination?.city}
              airport={destination?.primary_airport}
            />
          </div>

          {route.distance_km != null && (
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Route distance
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {route.distance_km.toLocaleString()} km
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Airport route information is not available for this trip.
        </p>
      )}

      {flights.length > 0 ? (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-slate-700">
            Available flight information
          </h4>

          <div className="mt-3 space-y-3">
            {flights.map((flight, index) => (
              <div
                key={flight.id || flight.flight_number || index}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="text-sm font-semibold text-slate-800">
                  {flight.airline || "Airline"}
                  {flight.flight_number
                    ? ` ? ${flight.flight_number}`
                    : ""}
                </p>

                {(flight.departure || flight.arrival) && (
                  <p className="mt-1 text-xs text-slate-500">
                    {flight.departure || "Departure unavailable"}
                    {" ? "}
                    {flight.arrival || "Arrival unavailable"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
          <p className="text-sm font-semibold text-cyan-900">
            Live flight data is not configured
          </p>

          <p className="mt-1 text-xs leading-5 text-cyan-800">
            {provider?.name || "Flight provider"} is not configured for this
            project, so live flight schedules and flight-specific details are
            not shown.
          </p>
        </div>
      )}
    </section>
  );
}

export default FlightCard;
