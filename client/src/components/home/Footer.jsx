import { Link, useLocation } from "react-router-dom";

import Container from "../ui/Container";

const exploreLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features", sectionId: "features" },
  {
    label: "Destinations",
    to: "/#destinations",
    sectionId: "destinations",
  },
  { label: "How It Works", to: "/#about", sectionId: "about" },
];

function Footer() {
  const location = useLocation();

  // Landing only scrolls when the hash changes, so clicking the link
  // for the hash already in the URL needs to scroll directly.
  function handleSectionClick(event, sectionId) {
    if (location.hash !== `#${sectionId}`) return;

    const section = document.getElementById(sectionId);

    if (section) {
      event.preventDefault();
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  // Already on the landing page with no hash: the route will not
  // change, so scroll to the top directly.
  function handleHomeClick(event) {
    if (location.pathname === "/" && !location.hash) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <footer className="bg-slate-950 py-20 text-white">
      <Container>
        <div className="grid gap-12 md:grid-cols-2">
          {/* Company */}

          <div>
            <h3 className="mb-4 text-3xl font-bold">
              Voyagent AI
            </h3>

            <p className="max-w-md leading-7 text-slate-400">
              Plan smarter, travel better, and create
              unforgettable experiences with AI.
            </p>
          </div>

          {/* Explore */}

          <nav aria-label="Footer">
            <h3 className="mb-4 text-xl font-semibold">
              Explore
            </h3>

            <ul className="space-y-1 text-slate-400">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={(event) =>
                      link.sectionId
                        ? handleSectionClick(event, link.sectionId)
                        : handleHomeClick(event)
                    }
                    className="inline-flex min-h-11 items-center rounded-lg transition hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-slate-500">
          © 2026 Voyagent AI. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;