import Container from "../ui/Container";
import Button from "../ui/Button";

function CTA() {
  return (
    <section className="py-20 bg-slate-900">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Plan Your Dream Trip?
          </h2>

          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            Let Voyagent AI create a personalized itinerary for your next adventure.
          </p>

          <Button>
            Start Planning
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default CTA;