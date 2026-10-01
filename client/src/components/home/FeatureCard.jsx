function FeatureCard({
  image,
  icon,
  title,
  description,
  steps,
  note,
  isOpen = false,
  onToggle,
}) {
  // Only cards that actually have an explanation look and act clickable.
  const isInteractive =
    Array.isArray(steps) &&
    steps.length > 0 &&
    typeof onToggle === "function";

  const panelId = `feature-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}-steps`;

  return (
    <div
      onClick={isInteractive ? onToggle : undefined}
      className={`
        overflow-hidden rounded-3xl
        border border-gray-100 bg-white
        shadow-lg transition-all duration-300
        ${
          isInteractive
            ? "group cursor-pointer hover:-translate-y-2 hover:shadow-2xl"
            : ""
        }
      `}
    >
      {/* Image */}

      <img
        src={image}
        alt={title}
        className="
          h-44 w-full object-cover
          transition-transform duration-500
          group-hover:scale-105
        "
      />

      {/* Content */}

      <div className="p-5">
        <div
          className="
            mb-4 flex h-14 w-14
            items-center justify-center
            rounded-2xl bg-cyan-50
            text-3xl transition-all duration-300
            group-hover:scale-110
          "
        >
          {icon}
        </div>

        <h3 className="mb-2 text-xl font-semibold text-slate-900">
          {title}
        </h3>

        <p className="leading-6 text-gray-600">
          {description}
        </p>

        {note && (
          <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {note}
          </span>
        )}

        {isInteractive && (
          <>
            {/* Clicking anywhere on the card toggles it; this button gives
                keyboard and screen-reader access to the same toggle. */}
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="
                mt-4 inline-flex items-center gap-1
                rounded-lg text-sm font-semibold
                text-teal-700 transition
                hover:text-teal-600
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-teal-400
              "
            >
              How it works
              <span
                aria-hidden="true"
                className={`transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {isOpen && (
              <ol
                id={panelId}
                onClick={(event) => event.stopPropagation()}
                className="mt-4 space-y-3 border-t border-gray-100 pt-4"
              >
                {steps.map((step, stepIndex) => (
                  <li
                    key={stepIndex}
                    className="flex gap-3 text-sm leading-6 text-gray-600"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-teal-700 ring-1 ring-teal-100">
                      {stepIndex + 1}
                    </span>

                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FeatureCard;