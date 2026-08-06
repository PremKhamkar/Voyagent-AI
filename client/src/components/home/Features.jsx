import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import FeatureCard from "./FeatureCard";

function Features() {
  const features = [
  {
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
    icon: "🤖",
    title: "AI Itinerary",
    description:
      "Generate personalized travel plans using AI.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    icon: "💰",
    title: "Budget Planner",
    description:
      "Estimate expenses before your trip.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800",
    icon: "🗺️",
    title: "Smart Maps",
    description:
      "Explore destinations with interactive maps.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800",
    icon: "🌦️",
    title: "Weather Insights",
    description:
      "Check live weather before travelling.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800",
    icon: "❤️",
    title: "Save Trips",
    description:
      "Save and revisit your favourite plans.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
    icon: "📄",
    title: "PDF Export",
    description:
      "Download your itinerary anytime.",
  },
];

  return (
   <section className="py-24 bg-white">
      

      
      {/* Main content */}

      <Container>
        <SectionTitle
          title="Everything You Need"
          subtitle="AI-powered tools designed to make every journey smarter, faster, and more affordable."
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
            key={index}
            image={feature.image}
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