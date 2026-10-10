import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";
import DESTINATION_VIDEOS from "../../constants/destinationVideos";
import ROUTES from "../../constants/routes";
import DESTINATION_GUIDES from "../../constants/destinationGuides";
import VERIFIED_DESTINATION_GUIDES from "../../constants/verifiedDestinationGuides";

const VIDEO_TIMEOUT_MS = 10000;
const IMAGE_REVEAL_TIMEOUT_MS = 3000;
const UHD_MIN_WIDTH = 1280;
const SWIPE_THRESHOLD_PX = 60;

// Returns the best background-video URL for this device, or null for image-only.
function pickVideoSource(entry) {
    if (!entry || typeof window === "undefined") return null;

    const reducedMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return null;

    const connection = navigator.connection;
    if (
        connection &&
        (connection.saveData ||
            ["slow-2g", "2g", "3g"].includes(connection.effectiveType))
    ) {
        return null;
    }

    if (window.innerWidth >= UHD_MIN_WIDTH && entry.uhd) return entry.uhd;
    return entry.hd || null;
}

// Extracts a video ID only from a recognized YouTube URL.
function getYouTubeVideoId(url) {
    if (!url) return null;

    try {
        const parsed = new URL(url);

        if (parsed.hostname === "youtu.be") {
            return parsed.pathname.split("/").filter(Boolean)[0] || null;
        }

        const isYouTubeHost =
            parsed.hostname === "youtube.com" ||
            parsed.hostname.endsWith(".youtube.com") ||
            parsed.hostname === "www.youtube-nocookie.com";

        if (!isYouTubeHost) return null;

        if (parsed.pathname === "/watch") {
            return parsed.searchParams.get("v");
        }

        const parts = parsed.pathname.split("/").filter(Boolean);
        if (["embed", "shorts", "live"].includes(parts[0])) {
            return parts[1] || null;
        }
    } catch {
        return null;
    }

    return null;
}

// Fades its children in right after mount.
function FadeIn({ className = "", children }) {
    const [entered, setEntered] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <div
            className={`
                transition-all duration-500 motion-reduce:transition-none
                ${entered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
                ${className}
            `}
        >
            {children}
        </div>
    );
}

function BackgroundVideo({ src, poster, visible, onPlaying, onFail }) {
    const ref = useRef(null);

    // Re-apply the source on setup because cleanup removes it. This also
    // supports React StrictMode's development cleanup/setup cycle.
    useEffect(() => {
        const video = ref.current;
        if (!video) return undefined;

        if (video.getAttribute("src") !== src) {
            video.setAttribute("src", src);
        }

        // React's muted attribute can be unreliable for autoplay.
        video.muted = true;

        // Stop playback and release the network connection when unmounted.
        return () => {
            video.pause();
            video.removeAttribute("src");
            video.load();
        };
    }, [src]);

    // Play while the section is on screen, pause when it is not.
    useEffect(() => {
        const video = ref.current;
        if (!video) return;

        if (visible) {
            const attempt = video.play();
            if (attempt?.catch) attempt.catch(() => {});
        } else {
            video.pause();
        }
    }, [src, visible]);

    return (
        <video
            ref={ref}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={onPlaying}
            onError={onFail}
            className="absolute inset-0 h-full w-full object-cover"
        />
    );
}

// One destination's visuals. The image is always the base layer; the video
// fades in over it only after it actually starts playing.
function MediaLayer({
    destination,
    loadVideo = false,
    isVisible = true,
    fadeIn = false,
}) {
    const [entered, setEntered] = useState(!fadeIn);
    const [imageReady, setImageReady] = useState(!fadeIn);
    const [imageFailed, setImageFailed] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [videoFailed, setVideoFailed] = useState(false);

    const source = useMemo(
        () =>
            loadVideo
                ? pickVideoSource(DESTINATION_VIDEOS[destination.id])
                : null,
        [loadVideo, destination.id]
    );

    useEffect(() => {
        if (!fadeIn) return undefined;

        const id = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(id);
    }, [fadeIn]);

    // Never leave the layer invisible if the image neither loads nor errors.
    useEffect(() => {
        if (imageReady) return undefined;

        const timer = setTimeout(
            () => setImageReady(true),
            IMAGE_REVEAL_TIMEOUT_MS
        );
        return () => clearTimeout(timer);
    }, [imageReady]);

    // Give up on a background video that never starts so the image remains.
    useEffect(() => {
        if (!source || !isVisible || videoPlaying || videoFailed) {
            return undefined;
        }

        const timer = setTimeout(() => setVideoFailed(true), VIDEO_TIMEOUT_MS);
        return () => clearTimeout(timer);
    }, [source, isVisible, videoPlaying, videoFailed]);

    const showVideo = Boolean(source) && !videoFailed;

    return (
        <div
            className={`
                absolute inset-0 transition-opacity duration-700
                motion-reduce:transition-none
                ${entered && imageReady ? "opacity-100" : "opacity-0"}
            `}
        >
            {imageFailed ? (
                <div
                    role="img"
                    aria-label={destination.title}
                    className="h-full w-full bg-gradient-to-br from-cyan-600 to-slate-800"
                />
            ) : (
                <img
                    src={destination.image}
                    alt=""
                    loading={fadeIn ? "eager" : "lazy"}
                    onLoad={() => setImageReady(true)}
                    onError={() => {
                        setImageFailed(true);
                        setImageReady(true);
                    }}
                    className="h-full w-full object-cover"
                />
            )}

            {showVideo && (
                <div
                    className={`
                        absolute inset-0 transition-opacity duration-700
                        motion-reduce:transition-none
                        ${videoPlaying ? "opacity-100" : "opacity-0"}
                    `}
                >
                    <BackgroundVideo
                        src={source}
                        poster={destination.image}
                        visible={isVisible}
                        onPlaying={() => setVideoPlaying(true)}
                        onFail={() => setVideoFailed(true)}
                    />
                </div>
            )}
        </div>
    );
}

function DestinationHero({
    destination,
    previous,
    loadVideo,
    isVisible,
    animate,
    onShuffle,
    onPrevious,
    onNext,
}) {
    const { title, country, description } = destination;
    const touchStartX = useRef(null);
    const [isGuidePlaying, setIsGuidePlaying] = useState(false);

    // Prefer an individual video. Destinations without one keep the search link.
    const guideUrl =
        VERIFIED_DESTINATION_GUIDES[destination.id] ||
        DESTINATION_GUIDES[destination.id];
    const verifiedVideoId = getYouTubeVideoId(
        VERIFIED_DESTINATION_GUIDES[destination.id]
    );

    // Stop the previous destination's guide when navigating to another card.
    useEffect(() => {
        setIsGuidePlaying(false);
    }, [destination.id]);

    function handleTouchStart(event) {
        // Ignore multi-touch gestures.
        if (event.touches.length === 1) {
            touchStartX.current = event.touches[0].clientX;
        }
    }

    function handleTouchEnd(event) {
        if (touchStartX.current === null) return;

        const deltaX =
            event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;

        // Ignore taps and short horizontal movements.
        if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

        if (deltaX > 0) {
            onPrevious?.();
        } else {
            onNext?.();
        }
    }

    return (
        <div className="w-full">
            <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="
                    relative isolate flex min-h-[540px] w-full items-end
                    overflow-hidden rounded-3xl bg-slate-900 shadow-2xl
                    sm:min-h-[500px] lg:min-h-[600px]
                "
            >
                {/* Outgoing destination remains visible during the crossfade. */}
                {previous && (
                    <MediaLayer
                        key={previous.id}
                        destination={previous}
                    />
                )}

                {/* Only the current destination can load a background video. */}
                <MediaLayer
                    key={destination.id}
                    destination={destination}
                    loadVideo={loadVideo}
                    isVisible={isVisible}
                    fadeIn={animate}
                />

                {/* Readability overlay above the background, below controls. */}
                <div
                    className={`
                        pointer-events-none absolute inset-0 z-[1]
                        bg-gradient-to-t from-black/80 via-black/30 to-black/10
                        ${isGuidePlaying ? "opacity-0" : "opacity-100"}
                    `}
                />

                {/* The individual YouTube video plays inside this same card. */}
                {isGuidePlaying && verifiedVideoId && (
                    <div className="absolute inset-0 z-30 bg-black">
                        <iframe
                            key={verifiedVideoId}
                            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
                                verifiedVideoId
                            )}?autoplay=1&rel=0`}
                            title={`${title} travel guide`}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />

                        <button
                            type="button"
                            onClick={() => setIsGuidePlaying(false)}
                            aria-label="Close travel video"
                            className="
                                absolute right-4 top-4 z-40 flex h-11 w-11
                                items-center justify-center rounded-full
                                border border-white/30 bg-black/70 text-2xl
                                text-white shadow-lg backdrop-blur
                                transition hover:bg-black
                                focus-visible:outline-none focus-visible:ring-4
                                focus-visible:ring-cyan-300
                            "
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Card navigation controls. */}
                {!isGuidePlaying && (
                    <>
                        <button
                            type="button"
                            onClick={onPrevious}
                            aria-label="Previous destination"
                            className="
                                absolute left-3 top-1/2 z-20 flex h-11 w-11
                                -translate-y-1/2 items-center justify-center
                                rounded-full border border-white/40 bg-black/40
                                text-3xl leading-none text-white shadow-lg
                                backdrop-blur-md transition hover:bg-black/70
                                focus-visible:outline-none focus-visible:ring-4
                                focus-visible:ring-cyan-300
                                sm:left-5 sm:h-12 sm:w-12
                            "
                        >
                            ‹
                        </button>

                        <button
                            type="button"
                            onClick={onNext}
                            aria-label="Next destination"
                            className="
                                absolute right-3 top-1/2 z-20 flex h-11 w-11
                                -translate-y-1/2 items-center justify-center
                                rounded-full border border-white/40 bg-black/40
                                text-3xl leading-none text-white shadow-lg
                                backdrop-blur-md transition hover:bg-black/70
                                focus-visible:outline-none focus-visible:ring-4
                                focus-visible:ring-cyan-300
                                sm:right-5 sm:h-12 sm:w-12
                            "
                        >
                            ›
                        </button>
                    </>
                )}

                {/* Content remains hidden while the video player is open. */}
                {!isGuidePlaying && (
                    <div
                        aria-live="polite"
                        className="relative z-10 w-full"
                    >
                        <FadeIn
                            key={destination.id}
                            className="p-6 sm:p-10 lg:p-14"
                        >
                            <div className="max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                                    Travel Inspiration
                                </p>

                                <h3 className="mt-3 break-words text-4xl font-bold uppercase tracking-wide text-white sm:text-5xl lg:text-6xl">
                                    {title}
                                </h3>

                                {country && (
                                    <p className="mt-1 text-base font-medium text-white/80">
                                        {country}
                                    </p>
                                )}

                                <p className="mt-4 text-lg font-semibold text-white sm:text-xl">
                                    Top 10 Places to Visit in {title}
                                </p>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                                    {description}
                                </p>

                                {/* Preserve the existing planner route behavior. */}
                                <Link
                                    to={ROUTES.PLANNER}
                                    className="
                                        mt-6 flex h-12 w-full items-center justify-center
                                        rounded-2xl bg-cyan-500 px-8 font-semibold
                                        text-white shadow-lg transition-all duration-300
                                        hover:-translate-y-0.5 hover:bg-cyan-600
                                        focus-visible:outline-none focus-visible:ring-4
                                        focus-visible:ring-cyan-300 sm:inline-flex sm:w-auto
                                    "
                                >
                                    Start planning
                                </Link>

                                {guideUrl && (
                                    verifiedVideoId ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsGuidePlaying(true)}
                                            className="
                                                mt-3 flex h-12 w-full items-center
                                                justify-center gap-2 rounded-2xl
                                                border border-white/40 bg-white/10 px-8
                                                font-semibold text-white backdrop-blur-md
                                                transition-all duration-300
                                                hover:-translate-y-0.5 hover:bg-white/20
                                                focus-visible:outline-none focus-visible:ring-4
                                                focus-visible:ring-cyan-300
                                                sm:ml-3 sm:mt-3 sm:inline-flex sm:w-auto
                                            "
                                        >
                                            <span aria-hidden="true">▶</span>
                                            Watch Travel Video
                                        </button>
                                    ) : (
                                        <a
                                            href={guideUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                                mt-3 flex h-12 w-full items-center
                                                justify-center gap-2 rounded-2xl
                                                border border-white/40 bg-white/10 px-8
                                                font-semibold text-white backdrop-blur-md
                                                transition-all duration-300
                                                hover:-translate-y-0.5 hover:bg-white/20
                                                focus-visible:outline-none focus-visible:ring-4
                                                focus-visible:ring-cyan-300
                                                sm:ml-3 sm:mt-3 sm:inline-flex sm:w-auto
                                            "
                                        >
                                            <span aria-hidden="true">▶</span>
                                            Watch Top 10 Places
                                        </a>
                                    )
                                )}
                            </div>
                        </FadeIn>
                    </div>
                )}
            </div>

            {/* Keep the existing random shuffle control. */}
            <div className="mx-auto mt-8 w-full max-w-[260px]">
                <Button
                    onClick={onShuffle}
                    className="
                        !h-12
                        focus-visible:outline-none focus-visible:ring-4
                        focus-visible:ring-cyan-300
                    "
                >
                    Shuffle Destination
                </Button>
            </div>
        </div>
    );
}

export default DestinationHero;
