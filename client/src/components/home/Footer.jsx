import Container from "../ui/Container";

function Footer() {
  return (
    <footer className="bg-slate-950 py-20 text-white">
      <Container>
        <div className="grid gap-12 md:grid-cols-4">
          {/* Company */}

          <div>
            <h3 className="mb-4 text-3xl font-bold">
              Voyagent AI
            </h3>

            <p className="leading-7 text-slate-400">
              Plan smarter, travel better, and create
              unforgettable experiences with AI.
            </p>
          </div>

          {/* Explore */}

          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Explore
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li className="hover:text-white">Home</li>
              <li className="hover:text-white">Destinations</li>
              <li className="hover:text-white">Features</li>
            </ul>
          </div>

          {/* Resources */}

          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Resources
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li className="hover:text-white">Travel Guides</li>
              <li className="hover:text-white">Blog</li>
              <li className="hover:text-white">Support</li>
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Contact
            </h3>

            <p className="mb-2 text-slate-400">
              support@voyagent.ai
            </p>

            <p className="text-slate-400">
              +91 98765 43210
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-slate-500">
          © 2026 Voyagent AI. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;