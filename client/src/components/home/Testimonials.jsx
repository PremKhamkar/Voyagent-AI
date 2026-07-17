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
  <section className="py-20 bg-slate-100">
    <Container>
        <SectionTitle
            title="What Our Travelers Say"
            subtitle="Hear from people who planned their trips with Voyagent AI."
        />
        <div className="grid md:grid-cols-3 gap-8">
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