import { useEffect, useRef, useState } from "react";

import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import DestinationHero from "./DestinationHero";
import DESTINATIONS from "../../constants/destinations";

// A new pick avoids the current destination and the last few shown, so it
// never repeats immediately and rarely bounces A -> B -> A.
const RECENT_WINDOW = 5;
const CROSSFADE_MS = 800;

function pickRandom(excludeIds = []) {
  const pool = DESTINATIONS.filter((d) => !excludeIds.includes(d.id));
  const list = pool.length ? pool : DESTINATIONS;
  return list[Math.floor(Math.random() * list.length)];
}

function PopularDestinations() {
  // Lazy initializer: one random pick per page load.
  const [current, setCurrent] = useState(() => pickRandom());
  const [previous, setPrevious] = useState(null);
  const [hasShuffled, setHasShuffled] = useState(false);

  // Without IntersectionObserver (very old browsers) treat the section as
  // always visible instead of never loading video.
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined"
  );
  // Sticky: video loads once the section has come near the viewport, and
  // from then on only plays/pauses with visibility (no re-download).
  const [hasEntered, setHasEntered] = useState(inView);

  const recent = useRef([current.id]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasEntered(true);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Drop the outgoing image layer once the crossfade is done.
  useEffect(() => {
    if (!previous) return undefined;
    const timer = setTimeout(() => setPrevious(null), CROSSFADE_MS);
    return () => clearTimeout(timer);
  }, [previous]);

  function handleShuffle() {
    const next = pickRandom(recent.current);
    recent.current = [...recent.current, next.id].slice(-RECENT_WINDOW);

    setPrevious(current);
    setCurrent(next);
    setHasShuffled(true);
  }

  return (
    <section
      id="destinations"
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24"
    >
      <Container>
        <SectionTitle
          title="Popular Destinations"
          subtitle="A hand-picked mix of places to inspire your next trip. Shuffle for new ideas."
        />

        <DestinationHero
          destination={current}
          previous={previous}
          loadVideo={hasEntered}
          isVisible={inView}
          animate={hasShuffled}
          onShuffle={handleShuffle}
        />
      </Container>
    </section>
  );
}

export default PopularDestinations;