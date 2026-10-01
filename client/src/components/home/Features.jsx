import { useState } from "react";

import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import FeatureCard from "./FeatureCard";

function Features() {
  const [openIndex, setOpenIndex] = useState(null);

  const features = [
  {
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
    icon: "🤖",
    title: "AI Itinerary",
    description:
      "Generate personalized travel plans using AI.",
    steps: [
      "You enter your trip details in the planner: source city, destination, dates, budget, travellers and preferences.",
      "A LangGraph workflow runs five AI planning steps one after another: destination, weather, budget, accommodation and itinerary.",
      "Each step builds on the earlier ones, so the itinerary is written with the destination, budget, stay suggestions and live weather already in hand.",
      "Real attractions, restaurants and hotels near your destination are looked up separately from Geoapify place data and shown next to the AI plan.",
      "You get a day-by-day itinerary. AI-generated text is a suggestion, not a booking.",
    ],
  },

  {
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    icon: "💰",
    title: "Budget Planner",
    description:
      "Estimate expenses before your trip.",
    steps: [
      "You enter your total budget (in ₹) and the number of travellers.",
      "The budget step reads your trip details, the destination analysis and the live weather.",
      "AI splits the total across accommodation, food, local transport, activities and emergency costs, aiming to stay within your budget.",
      "Weather can change the split, for example more indoor activities or rain gear when rain is expected.",
      "These are AI-generated estimates, not live prices.",
    ],
  },

  {
    image:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800",
    icon: "🗺️",
    title: "Smart Maps",
    description:
      "Explore destinations with interactive maps.",
    steps: [
      "Once your plan is ready, the planner shows an embedded Google Map for your destination.",
      "Switch views to see the destination, tourist attractions around it, or driving directions from your source city.",
      "Restaurant and hotel cards also have an Open in Maps link to their location.",
    ],
  },

  {
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800",
    icon: "🌦️",
    title: "Weather Insights",
    description:
      "Check live weather before travelling.",
    steps: [
      "When you plan a trip, the app looks up the destination's current weather and forecast from OpenWeather.",
      "The planner shows it in a weather card.",
      "The same weather data is passed to the budget, accommodation and itinerary steps so suggestions can adapt, for example to rain or heat.",
      "If the weather can't be fetched, it is shown as unavailable instead of invented values.",
    ],
  },

  {
    image:
      "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800",
    icon: "❤️",
    title: "Save Trips",
    description:
      "Save and revisit your favourite plans.",
    steps: [
      "The planner needs an account, so you sign in or register first.",
      "After a plan is generated, choose Save Trip.",
      "Your trip details, the generated itinerary, budget, destination and accommodation plans, and a weather snapshot are stored against your account.",
      "Open them any time from Saved Trips to view the details, or delete a trip.",
      "Live lists such as restaurants and hotels are not saved with the trip.",
    ],
  },

  {
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
    icon: "📄",
    title: "PDF Export",
    description:
      "Download your itinerary anytime.",
    note: "Not available yet",
  },
];

  return (
   <section id="features" className="py-24 bg-white">
      

      
      {/* Main content */}

      <Container>
        <SectionTitle
          title="Everything You Need"
          subtitle="AI-powered tools designed to make every journey smarter, faster, and more affordable."
        />

        <div className="grid items-start gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
            key={index}
            image={feature.image}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            steps={feature.steps}
            note={feature.note}
            isOpen={openIndex === index}
            onToggle={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
            />          
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Features;