import Container from "../ui/Container";
import Button from "../ui/Button";

function CTA({ openAuth }) {
  return (
    <section className="bg-slate-900 py-24">
      <Container>
        <div className="rounded-[40px] bg-gradient-to-r from-cyan-600 to-blue-700 p-12 text-center shadow-2xl">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Ready for Your Next Adventure?
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-100">
            Let Voyagent AI create a personalized travel plan,
            estimate your expenses, and help you explore the
            world more intelligently.
          </p>

          <Button
          onClick={openAuth}
          className="rounded-xl bg-white px-8 py-3 font-semibold text-slate-900 hover:bg-gray-100"
          >
          Start Planning
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default CTA;