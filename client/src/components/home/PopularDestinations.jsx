import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import DestinationCard from "./DestinationCard";

function PopularDestinations() {

  const destinations = [
    {
      title: "Goa",
      description: "Beautiful beaches of India",
      image: "https://picsum.photos/400/300?random=1",
    },
    {
      title: "Paris",
      description: "City of Love",
      image: "https://picsum.photos/400/300?random=2",
    },
    {
      title: "Tokyo",
      description: "Technology and Culture",
      image: "https://picsum.photos/400/300?random=3",
    },
  ];

  return (
    <section className="py-20 bg-white">
        <Container>
            <SectionTitle
            title="Popular Destinations"
            subtitle="Explore amazing places around the world."
    />
   <div className="grid md:grid-cols-3 gap-8">
  {destinations.map((destination, index) => (
    <DestinationCard
      key={index}
      image={destination.image}
      title={destination.title}
      description={destination.description}
    />
  ))}
</div>
        </Container>

    </section>
  );
}

export default PopularDestinations;