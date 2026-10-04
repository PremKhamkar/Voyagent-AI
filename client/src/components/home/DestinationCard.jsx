import { useState } from "react";
import { Link } from "react-router-dom";

import ROUTES from "../../constants/routes";

function DestinationCard({ image, title, country, description }) {
  const [imageFailed, setImageFailed] = useState(false);

  const place = country ? `${title}, ${country}` : title;

  return (
    <div
      className="
        mx-auto flex h-full w-full max-w-[350px] flex-col
        overflow-hidden rounded-3xl
        bg-white shadow-xl
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl
      "
    >
      {/* Image */}

      <div className="h-[220px] shrink-0 overflow-hidden bg-slate-200">
        {imageFailed ? (
          <div
            role="img"
            aria-label={place}
            className="
              flex h-full w-full items-center justify-center
              bg-gradient-to-br from-cyan-500 to-slate-700
              text-2xl font-bold text-white
            "
          >
            {title}
          </div>
        ) : (
          <img
            src={image}
            alt={place}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="
              h-full w-full object-cover
              transition-transform duration-500
              hover:scale-110
            "
          />
        )}
      </div>

      {/* Content */}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-2xl font-bold">{title}</h3>

        {country && (
          <p className="mt-1 text-sm font-medium text-cyan-700">
            {country}
          </p>
        )}

        <p className="mt-3 mb-5 text-gray-600">{description}</p>

        <div className="mt-auto">
          {/* The planner does not take a destination yet, so this does not
              claim to. Logged-out visitors are sent to login by the
              planner route's existing ProtectedRoute. */}
          <Link
            to={ROUTES.PLANNER}
            className="
              flex h-12 w-full items-center justify-center
              rounded-2xl bg-cyan-500 px-6
              font-semibold text-white shadow-lg
              transition-all duration-300
              hover:-translate-y-0.5 hover:bg-cyan-600
              focus-visible:outline-none focus-visible:ring-4
              focus-visible:ring-cyan-300
            "
          >
            Start planning
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DestinationCard;
