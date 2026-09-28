import {
    useLayoutEffect,
    useRef,
    useState,
} from "react";

// Content taller than this (in px) gets folded
// behind a "Show full details" button.
const COLLAPSED_HEIGHT = 384;

function SectionCard({
    icon,
    iconClassName = "bg-slate-100",
    title,
    subtitle,
    children,
}) {
    const innerRef = useRef(null);

    const [isOverflowing, setIsOverflowing] =
        useState(false);

    const [isExpanded, setIsExpanded] =
        useState(false);

    useLayoutEffect(() => {
        const element = innerRef.current;

        if (!element) {
            return;
        }

        function checkHeight() {
            setIsOverflowing(
                element.offsetHeight >
                COLLAPSED_HEIGHT + 40
            );
        }

        checkHeight();

        const observer = new ResizeObserver(
            checkHeight
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const isFolded =
        isOverflowing && !isExpanded;

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${iconClassName}`}
                >
                    {icon}
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="text-sm text-slate-500">
                            {subtitle}
                        </p>
                    )}
                </div>

            </div>

            <div
                className="relative overflow-hidden"
                style={{
                    maxHeight: isFolded
                        ? `${COLLAPSED_HEIGHT}px`
                        : "none",
                }}
            >
                <div ref={innerRef}>{children}</div>

                {isFolded && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
                )}
            </div>

            {isOverflowing && (
                <button
                    type="button"
                    onClick={() =>
                        setIsExpanded((current) => !current)
                    }
                    className="mt-4 text-sm font-semibold text-cyan-600 transition hover:text-cyan-700"
                >
                    {isExpanded
                        ? "Show less"
                        : "Show full details"}
                </button>
            )}

        </section>
    );
}

export default SectionCard;