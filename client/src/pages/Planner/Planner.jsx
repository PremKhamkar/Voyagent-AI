import { useState } from "react";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";

function Planner() {
  const [trip, setTrip] = useState({
  destination: "",
  startDate: "",
  endDate: "",
  budget: "",
  travelers: 1,
  travelType: "Solo",
  preferences: [],
});

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [generatedTrip, setGeneratedTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setTrip((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
  event.preventDefault();

  const newErrors = {};

  if (!trip.destination.trim()) {
    newErrors.destination = "Destination is required.";
  }

  if (!trip.startDate) {
    newErrors.startDate = "Start date is required.";
  }

  if (!trip.endDate) {
    newErrors.endDate = "End date is required.";
  }

  if (
    trip.startDate &&
    trip.endDate &&
    trip.endDate < trip.startDate
  ) {
    newErrors.endDate =
      "End date cannot be before start date.";
  }

  if (!trip.budget || Number(trip.budget) <= 0) {
    newErrors.budget =
      "Budget must be greater than 0.";
  }

  if (Number(trip.travelers) < 1) {
    newErrors.travelers =
      "At least 1 traveler is required.";
  }

  setErrors(newErrors);

if (Object.keys(newErrors).length > 0) {
  return;
}

setLoading(true);

try {
  const response = await fetch("http://127.0.0.1:8000/generate-trip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trip),
  });

  const data = await response.json();
  console.log(data);

setGeneratedTrip(data.trip);
setItinerary(data.itinerary);

} catch (error) {
  console.error("Error:", error);

} finally {
  setLoading(false);
}
}

function handlePreferenceChange(event) {
  const { value, checked } = event.target;

  if (checked) {
    setTrip((prev) => ({
      ...prev,
      preferences: [...prev.preferences, value],
    }));
  } else {
    setTrip((prev) => ({
      ...prev,
      preferences: prev.preferences.filter(
        (item) => item !== value
      ),
    }));
  }
}
const preferences = [
  "Adventure",
  "Beach",
  "Nature",
  "Food",
  "Luxury",
  "Shopping",
  "Historical",
  "Nightlife",
];
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Container>
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

          <h1 className="text-3xl font-bold mb-2">
            🗺️ Plan Your Next Journey
          </h1>

          <p className="text-gray-500 mb-8">
            Tell us about your trip and let AI create the perfect itinerary.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="font-medium">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                value={trip.destination}
                onChange={handleChange}
                placeholder="e.g. Japan"
                className="w-full mt-2 border rounded-lg px-4 py-3"
              />
              {errors.destination && (
              <p className="text-red-500 text-sm mt-1">
              {errors.destination}
              </p>
              )}
            </div>

            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={trip.startDate}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-lg px-4 py-3"
                />
                {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                {errors.startDate}
                </p>
                )}
              </div>

              <div>
                <label className="font-medium">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={trip.endDate}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-lg px-4 py-3"
                />
                {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">
                {errors.endDate}
                </p>
                )}
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium">
                  Budget (₹)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={trip.budget}
                  onChange={handleChange}
                  placeholder="50000"
                  className="w-full mt-2 border rounded-lg px-4 py-3"
                />
                {errors.budget && (
                <p className="text-red-500 text-sm mt-1">
                {errors.budget}
                </p>
                )}
              </div>

              <div>
                <label className="font-medium">
                  Travelers
                </label>
                <input
                  type="number"
                  name="travelers"
                  value={trip.travelers}
                  onChange={handleChange}
                  min="1"
                  className="w-full mt-2 border rounded-lg px-4 py-3"
                />
                {errors.travelers && (
                <p className="text-red-500 text-sm mt-1">
                {errors.travelers}
                </p>
                )}
              </div>

            </div>

            <div>
              <label className="font-medium">
                Travel Type
              </label>

              <select
                name="travelType"
                value={trip.travelType}
                onChange={handleChange}
                className="w-full mt-2 border rounded-lg px-4 py-3"
              >
                <option>Solo</option>
                <option>Couple</option>
                <option>Family</option>
                <option>Friends</option>
                <option>Business</option>
              </select>
            </div>

            <div>
  <label className="font-medium block mb-3">
    Trip Preferences
  </label>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {preferences.map((item) => (
      <label
        key={item}
        className="flex items-center gap-2"
      >
        <input
          type="checkbox"
          value={item}
          onChange={handlePreferenceChange}
        />

        {item}
      </label>
    ))}
  </div>
</div>

            <Button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {loading ? "Generating AI Plan..." : "Generate AI Plan"}
            </Button>

          </form>

          {generatedTrip && (
  <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
    <h2 className="text-2xl font-bold mb-4">
      🗺️ Generated Trip Summary
    </h2>

    <p>
      <strong>🌍 Destination:</strong>{" "}
      {generatedTrip.destination}
    </p>

    <p>
      <strong>📅 Dates:</strong>{" "}
      {generatedTrip.startDate} → {generatedTrip.endDate}
    </p>

    <p>
      <strong>💰 Budget:</strong> ₹{generatedTrip.budget}
    </p>

    <p>
      <strong>👥 Travelers:</strong>{" "}
      {generatedTrip.travelers}
    </p>

    <p>
      <strong>❤️ Travel Type:</strong>{" "}
      {generatedTrip.travelType}
    </p>

    <p>
      <strong>🎯 Preferences:</strong>{" "}
      {generatedTrip.preferences.join(", ")}
    </p>
  </div>
)}
{itinerary && (
  <div className="mt-8 p-6 bg-white rounded-xl shadow">
    <h2 className="text-2xl font-bold mb-4">
      ✨ AI Travel Itinerary
    </h2>

    <pre className="whitespace-pre-wrap text-gray-700">
      {itinerary}
    </pre>
  </div>
)}

        </div>
      </Container>
    </div>
  );
}

export default Planner;