import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import DestinationCard from "./DestinationCard";

function PopularDestinations() {
  const destinations = [
    {
      title: "Goa",
      description: "Beautiful beaches of India",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    },
    {
      title: "Paris",
      description: "City of Love",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    },
    {
      title: "Tokyo",
      description: "Technology and Culture",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24">
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
            subtitle="Discover incredible destinations selected by our AI planner."
          />

          {/* Cards */}

          <div className="mt-20 p-12">
            <div className="mx-auto grid max-w-7xl place-items-center gap-14 lg:grid-cols-3">
              {destinations.map((destination, index) => (
                <DestinationCard
                  key={index}
                  image={destination.image}
                  title={destination.title}
                  description={destination.description}
                />
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

export default PopularDestinations;