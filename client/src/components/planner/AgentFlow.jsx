import { useEffect, useState } from "react";

function formatElapsed(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function StatusIcon({ status }) {
  if (status === "done") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
        ✓
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
        !
      </span>
    );
  }

  return (
    <span className="h-6 w-6 shrink-0 animate-spin rounded-full border-2 border-cyan-200 border-t-cyan-600" />
  );
}

function AgentFlow({
  attractionsLoading = false,
  attractionsError = "",
  restaurantsLoading = false,
  restaurantsError = "",
  hotelsLoading = false,
  hotelsError = "",
}) {
  const [elapsed, setElapsed] = useState(0);

  // A real timer: counts seconds since generation started.
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Real status: this mirrors the actual /attractions request.
  let attractionsStatus = "done";

  if (attractionsLoading) {
    attractionsStatus = "loading";
  } else if (attractionsError) {
    attractionsStatus = "failed";
  }

  const attractionsDetail = {
    loading: "Looking up real places and photos",
    done: "Verified places are ready",
    failed: "Not available - AI suggestions will be used instead",
  }[attractionsStatus];

  // Real status: this mirrors the actual /restaurants request.
  let restaurantsStatus = "done";

  if (restaurantsLoading) {
    restaurantsStatus = "loading";
  } else if (restaurantsError) {
    restaurantsStatus = "failed";
  }

  const restaurantsDetail = {
    loading: "Looking up real restaurants and cafés",
    done: "Verified restaurant listings are ready",
    failed: "Not available right now",
  }[restaurantsStatus];

  // Real status: this mirrors the actual /hotels request.
  let hotelsStatus = "done";

  if (hotelsLoading) {
    hotelsStatus = "loading";
  } else if (hotelsError) {
    hotelsStatus = "failed";
  }

  const hotelsDetail = {
    loading: "Looking up real hotels near your destination",
    done: "Verified hotel listings are ready",
    failed: "Not available right now",
  }[hotelsStatus];

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-800">
            Generating your travel plan
          </p>

          <p className="mt-1 text-xs text-slate-500">
            This can take a little while. Please keep this tab open.
          </p>
        </div>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold tabular-nums text-slate-500 shadow-sm">
          {formatElapsed(elapsed)}
        </span>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-teal-500 to-blue-600" />
      </div>

      <ul className="mt-5 space-y-3">
        <li className="flex items-start gap-3">
          <StatusIcon status="loading" />

          <div>
            <p className="text-sm font-semibold text-slate-700">
              Writing your itinerary, budget and stay suggestions
            </p>

            <p className="text-xs text-slate-500">
              Built in several AI steps that run one after another
            </p>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <StatusIcon status={attractionsStatus} />

          <div>
            <p className="text-sm font-semibold text-slate-700">
              Finding verified attractions
            </p>

            <p className="text-xs text-slate-500">{attractionsDetail}</p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <StatusIcon status={restaurantsStatus} />

          <div>
            <p className="text-sm font-semibold text-slate-700">
              Finding restaurants and cafés
            </p>

            <p className="text-xs text-slate-500">{restaurantsDetail}</p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <StatusIcon status={hotelsStatus} />

          <div>
            <p className="text-sm font-semibold text-slate-700">
              Finding hotels near your destination
            </p>

            <p className="text-xs text-slate-500">{hotelsDetail}</p>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default AgentFlow;