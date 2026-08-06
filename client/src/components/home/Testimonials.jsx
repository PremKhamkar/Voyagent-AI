import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import TestimonialCard from "./TestimonialCard";
function Testimonials() {
const testimonials = [
  {
    name: "Alex",
    review: "Voyagent AI planned my entire trip perfectly. Highly recommended!",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Sarah",
    review: "The itinerary was amazing and saved me a lot of time.",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Rahul",
    review: "Simple, fast, and very helpful for planning vacations.",
    image: "https://i.pravatar.cc/150?img=3",
  },
];
return (
  <section
  className="
    relative overflow-hidden py-24
    bg-gradient-to-b
    from-slate-50
    via-white
    to-cyan-50
  "
>
  <div
  className="
    absolute right-20 bottom-20
    h-48 w-48 rounded-full
    bg-indigo-100 blur-3xl
    opacity-50
  "
></div>
    <Container>
        <SectionTitle
            title="Trusted by Travelers Worldwide"
            subtitle="Discover how Voyagent AI is helping people create unforgettable journeys."
        />
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial, index) => (
            <TestimonialCard
            key={index}
            name={testimonial.name}
            review={testimonial.review}
            image={testimonial.image}
        />
))}

        </div>

    </Container>

  </section>
);
}
export default Testimonials;