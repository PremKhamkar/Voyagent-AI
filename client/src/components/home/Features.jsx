import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import FeatureCard from "./FeatureCard";

function Features() {

  const features = [
    {
      icon: "🤖",
      title: "AI Itinerary",
      description:
        "Generate personalized travel plans using AI."
    },
    {
      icon: "💰",
      title: "Budget Planner",
      description:
        "Estimate expenses before your trip."
    },
    {
      icon: "🗺️",
      title: "Smart Maps",
      description:
        "Explore destinations with interactive maps."
    },
    {
      icon: "🌦️",
      title: "Weather Insights",
      description:
        "Check live weather before travelling."
    },
    {
      icon: "❤️",
      title: "Save Trips",
      description:
        "Save and revisit your favourite plans."
    },
    {
      icon: "📄",
      title: "PDF Export",
      description:
        "Download your itinerary anytime."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">

      <Container>

        <SectionTitle
          title="Why Choose Voyagent AI?"
          subtitle="Everything you need to plan your journey in one place."
        />

        <div className="grid md:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}

        </div>

      </Container>

    </section>
  );
}

export default Features;