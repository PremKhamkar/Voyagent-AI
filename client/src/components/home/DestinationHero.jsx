import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";
import DESTINATION_VIDEOS from "../../constants/destinationVideos";
import ROUTES from "../../constants/routes";

const VIDEO_TIMEOUT_MS = 10000;
const IMAGE_REVEAL_TIMEOUT_MS = 3000;
const UHD_MIN_WIDTH = 1280;

// Returns the best video URL for this device, or null for image-only.
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

    // Setup/cleanup for the lifetime of this source. The src is re-applied
    // on setup because cleanup removes it (StrictMode runs cleanup then setup
    // again in development, and React will not restore a removed attribute).
    useEffect(() => {
        const video = ref.current;
        if (!video) return undefined;

        if (video.getAttribute("src") !== src) {
            video.setAttribute("src", src);
        }
        video.muted = true; // React's muted attribute is unreliable for autoplay

        // Stop playback and release the network connection.
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
            if (attempt?.catch) attempt.catch(() => { }); // autoplay blocked: poster stays
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
// (if any) fades in on top once it is actually playing. A layer with
// `fadeIn` waits for its image before fading in, so a shuffle never shows a
// half-loaded picture.
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
            loadVideo ? pickVideoSource(DESTINATION_VIDEOS[destination.id]) : null,
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

    // Give up on a video that never starts so nothing waits forever. The timer
    // only runs while the section is visible (a paused video can't start).
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
}) {
    const { title, country, description } = destination;

    return (
        <div className="w-full">
            <div
                className="
          relative isolate flex min-h-[540px] w-full items-end
          overflow-hidden rounded-3xl bg-slate-900 shadow-2xl
          sm:min-h-[500px] lg:min-h-[600px]
        "
            >
                {/* Outgoing destination: same key as when it was current, so React
            keeps the already-painted layer instead of rebuilding it. It
            receives no loadVideo, so its video unmounts (and stops) the
            moment a shuffle happens. */}
                {previous && <MediaLayer key={previous.id} destination={previous} />}

                {/* Current destination: the only layer that can load a video. */}
                <MediaLayer
                    key={destination.id}
                    destination={destination}
                    loadVideo={loadVideo}
                    isVisible={isVisible}
                    fadeIn={animate}
                />

                {/* Readability overlay */}
                <div
                    className="
            pointer-events-none absolute inset-0
            bg-gradient-to-t from-black/80 via-black/30 to-black/10
          "
                />

                {/* Content. The live region is stable; only its content remounts. */}
                <div aria-live="polite" className="relative z-10 w-full">
                    <FadeIn key={destination.id} className="p-6 sm:p-10 lg:p-14">
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

                            {/* Unchanged behavior: the planner does not take a destination
                  yet, and logged-out visitors are sent to login by the
                  planner route's existing ProtectedRoute. */}
                            <Link
                                to={ROUTES.PLANNER}
                                className="
                  mt-6 flex h-12 w-full items-center justify-center
                  rounded-2xl bg-cyan-500 px-8
                  font-semibold text-white shadow-lg
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:bg-cyan-600
                  focus-visible:outline-none focus-visible:ring-4
                  focus-visible:ring-cyan-300
                  sm:inline-flex sm:w-auto
                "
                            >
                                Start planning
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Shuffle control */}
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