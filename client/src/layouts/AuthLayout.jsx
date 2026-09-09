import { Link } from "react-router-dom";

function AuthLayout({ children, isModal = false }) {
  if (isModal) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-6">
      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:min-h-[calc(100vh-3rem)]">
        
        {/* =====================================================
            LEFT — TRAVEL SHOWCASE
        ====================================================== */}
        <div className="relative hidden w-1/2 overflow-hidden lg:block">
          {/* Background */}
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800"
            alt="Beautiful tropical travel destination"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/30 to-cyan-950/60" />

          {/* Brand */}
          <Link
            to="/"
            className="absolute left-8 top-8 z-10 flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl text-white shadow-lg backdrop-blur-md">
              ✈
            </div>

            <span className="text-xl font-bold tracking-wide text-white">
              Voyagent AI
            </span>
          </Link>

          {/* Main Message */}
          <div className="absolute bottom-10 left-8 right-8 z-10 text-white">
            <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
              AI Powered Travel
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-tight xl:text-6xl">
              Plan smarter.
              <br />
              Travel better.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-white/75 xl:text-lg">
              Discover destinations, build personalized itineraries,
              estimate your budget, and make every journey unforgettable.
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT — AUTH CONTENT
        ====================================================== */}
        <div className="flex w-full flex-col bg-white lg:w-1/2">
          
          {/* Mobile Brand */}
          <div className="flex items-center justify-between px-6 pt-6 lg:hidden">
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-900"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                ✈
              </div>

              <span className="font-bold">
                Voyagent AI
              </span>
            </Link>
          </div>

          {/* Authentication Content */}
          <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Voyagent AI. Plan smarter. Travel better.
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;