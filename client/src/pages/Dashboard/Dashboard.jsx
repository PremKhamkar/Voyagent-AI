import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              AI Travel Planner
            </h1>

            <p className="text-gray-500 text-sm">
              Plan smarter with AI
            </p>
          </div>

          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-10">
          <h2 className="text-3xl font-bold">
            Welcome Back 👋
          </h2>

          <p className="text-gray-500 mt-2">
            Where would you like to travel today?
          </p>
        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-3 gap-6">

          <Link
            to="/planner"
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
          >
            <div className="text-4xl mb-3">🗺️</div>

            <h3 className="font-bold text-xl">
              Plan New Trip
            </h3>

            <p className="text-gray-500 mt-2">
              Let AI create your perfect itinerary.
            </p>
          </Link>

          <Link
            to="/saved-trips"
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
          >
            <div className="text-4xl mb-3">📌</div>

            <h3 className="font-bold text-xl">
              Saved Trips
            </h3>

            <p className="text-gray-500 mt-2">
              View all your previous trips.
            </p>
          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
          >
            <div className="text-4xl mb-3">👤</div>

            <h3 className="font-bold text-xl">
              Profile
            </h3>

            <p className="text-gray-500 mt-2">
              Update your preferences.
            </p>
          </Link>

        </div>

        {/* Recent Trips */}

        <div className="mt-10 bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-semibold mb-4">
            Recent Trips
          </h2>

          <div className="space-y-3">

            <div className="border rounded-lg p-4">
              Goa Trip
            </div>

            <div className="border rounded-lg p-4">
              Manali Adventure
            </div>

            <div className="border rounded-lg p-4">
              Dubai Vacation
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;