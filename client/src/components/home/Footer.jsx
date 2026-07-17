import Container from "../ui/Container";

function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-16">
      <Container>
        {/* Footer Grid */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* Column 1 - Company */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Voyagent AI
            </h3>

            <p className="text-slate-400">
              Plan smarter. Travel better.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2 text-slate-400">
              <li>Home</li>
              <li>Features</li>
              <li>About</li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Contact
            </h3>

            <p className="text-slate-400">
              support@voyagent.ai
            </p>

            <p className="text-slate-400 mt-2">
              +91 98765 43210
            </p>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-500">
          © 2026 Voyagent AI. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;