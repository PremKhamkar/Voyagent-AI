import { useEffect, useRef, useState } from "react";

import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import DestinationHero from "./DestinationHero";
import DESTINATIONS from "../../constants/destinations";

// A new pick avoids the current destination and the last few shown.
const RECENT_WINDOW = 5;
const CROSSFADE_MS = 800;

function pickRandom(excludeIds = []) {
  const pool = DESTINATIONS.filter((d) => !excludeIds.includes(d.id));
  const list = pool.length ? pool : DESTINATIONS;
  return list[Math.floor(Math.random() * list.length)];
}

function PopularDestinations() {
  const [current, setCurrent] = useState(() => pickRandom());
  const [previous, setPrevious] = useState(null);
  const [hasShuffled, setHasShuffled] = useState(false);

  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined"
  );
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

  useEffect(() => {
    if (!previous) return undefined;
    const timer = setTimeout(() => setPrevious(null), CROSSFADE_MS);
    return () => clearTimeout(timer);
  }, [previous]);

  function showDestination(next) {
    if (!next || next.id === current.id) return;

    recent.current = [...recent.current, next.id].slice(-RECENT_WINDOW);

    setPrevious(current);
    setCurrent(next);
    setHasShuffled(true);
  }

  function handleShuffle() {
    showDestination(pickRandom(recent.current));
  }

  function handleNavigate(direction) {
    const currentIndex = DESTINATIONS.findIndex(
      (destination) => destination.id === current.id
    );

    if (currentIndex === -1 || DESTINATIONS.length < 2) return;

    const nextIndex =
      (currentIndex + direction + DESTINATIONS.length) %
      DESTINATIONS.length;

    showDestination(DESTINATIONS[nextIndex]);
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
          subtitle="A hand-picked mix of places to inspire your next trip. Use the arrows to browse or shuffle for a surprise."
        />

        <DestinationHero
          destination={current}
          previous={previous}
          loadVideo={hasEntered}
          isVisible={inView}
          animate={hasShuffled}
          onShuffle={handleShuffle}
          onPrevious={() => handleNavigate(-1)}
          onNext={() => handleNavigate(1)}
        />
      </Container>
    </section>
  );
}

export default PopularDestinations;