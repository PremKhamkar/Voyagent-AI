import { useState } from "react";

import Button from "../ui/Button";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import DestinationCard from "./DestinationCard";
import DESTINATIONS from "../../constants/destinations";

const VISIBLE_COUNT = 3;

function setKey(destinations) {
  return destinations
    .map((destination) => destination.id)
    .sort()
    .join("|");
}

// Picks VISIBLE_COUNT distinct destinations at random (Fisher-Yates).
// When a previous set is given, it tries to return a different set.
function pickDestinations(previous = []) {
  const previousKey = previous.length ? setKey(previous) : null;
  let picked = [];

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const pool = [...DESTINATIONS];

    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    picked = pool.slice(0, VISIBLE_COUNT);

    if (setKey(picked) !== previousKey) {
      break;
    }
  }

  return picked;
}

function PopularDestinations() {
  // Lazy initializer: the random pick happens once per page load and
  // stays the same across normal re-renders.
  const [destinations, setDestinations] = useState(() =>
    pickDestinations()
  );

  function handleShuffle() {
    setDestinations(pickDestinations(destinations));
  }

  return (
    <section id="destinations" className="relative overflow-hidden py-24">
      {/* Mountain background */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000')",
        }}
      ></div>

      {/* Light overlay */}



      {/* Content */}

      <div className="relative z-10">
        <Container>
          <SectionTitle
            title="Popular Destinations"
            subtitle="A hand-picked mix of places to inspire your next trip. Shuffle for new ideas."
          />

          {/* Cards */}

          <div className="mt-12 lg:mt-20 lg:p-12">
            <div
              className="
                mx-auto grid max-w-7xl grid-cols-1 gap-8
                md:grid-cols-2 md:[&>:last-child]:col-span-2
                lg:grid-cols-3 lg:gap-14 lg:[&>:last-child]:col-span-1
              "
            >
              {destinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  image={destination.image}
                  title={destination.title}
                  country={destination.country}
                  description={destination.description}
                />
              ))}
            </div>

            {/* Shuffle */}

            <div className="mx-auto mt-12 w-full max-w-[220px]">
              <Button
                onClick={handleShuffle}
                className="
                  !h-12 !bg-white !text-cyan-700 hover:!bg-cyan-50
                  focus-visible:outline-none focus-visible:ring-4
                  focus-visible:ring-cyan-300
                "
              >
                Shuffle destinations
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

export default PopularDestinations;
