import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import StepCard from "./StepCard";

function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Choose Destination",
      description: "Select where you want to travel.",
    },
    {
      number: "2",
      title: "AI Plans Your Trip",
      description: "Voyagent AI creates a personalized itinerary.",
    },
    {
      number: "3",
      title: "Travel & Enjoy",
      description: "Explore your destination and download your itinerary.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <Container>
        <SectionTitle
          title="Plan Your Journey in Three Steps"
          subtitle="Voyagent AI helps you create personalized travel plans in just a few clicks."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default HowItWorks;