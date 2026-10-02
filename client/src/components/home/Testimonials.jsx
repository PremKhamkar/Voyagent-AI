import { useEffect, useState } from "react";
import API_BASE_URL from "../../constants/api";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const ratings = [1, 2, 3, 4, 5];

function Testimonials() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  useEffect(() => {
  if (status !== "success") return;

  const timer = setTimeout(() => {
    setStatus("idle");
  }, 5000);

  return () => clearTimeout(timer);
}, [status]);

  async function handleSubmit(event) {
    event.preventDefault();

    setStatus("submitting");

    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to submit feedback.");
      }

      setRating(0);
      setMessage("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const isSubmitting = status === "submitting";

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
          title="Share Your Feedback"
          subtitle="Tell us how Voyagent AI is helping you plan your journeys."
        />

        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting}>
              <legend className="mb-4 text-lg font-semibold text-slate-900">
                How would you rate your experience?
              </legend>

              <div
                className="mb-6 flex gap-2"
                role="radiogroup"
                aria-label="Rating"
              >
                {ratings.map((value) => {
                  const selected = value <= rating;

                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={value === rating}
                      aria-label={`${value} out of 5 stars`}
                      onClick={() => setRating(value)}
                      className={`text-3xl transition ${
                        selected
                          ? "text-amber-400"
                          : "text-slate-300 hover:text-amber-300"
                      }`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>

              <label
                htmlFor="feedback-message"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Your feedback
              </label>

              <textarea
                id="feedback-message"
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (status !== "idle") {
                    setStatus("idle");
                  }
                }}
                placeholder="Tell us what you liked or what we could improve."
                minLength={3}
                maxLength={1000}
                required
                rows={5}
                className="
                  w-full rounded-2xl border border-slate-300
                  px-4 py-3 text-slate-900
                  outline-none transition
                  placeholder:text-slate-400
                  focus:border-teal-500
                  focus:ring-2 focus:ring-teal-100
                "
              />

              <div className="mt-2 flex justify-end text-xs text-slate-400">
                {message.length}/1000
              </div>

              <button
                type="submit"
                disabled={rating === 0 || message.trim().length < 3}
                className="
                  mt-5 min-h-11 rounded-xl bg-teal-600
                  px-6 py-3 font-semibold text-white
                  transition hover:bg-teal-700
                  disabled:cursor-not-allowed
                  disabled:bg-slate-300
                "
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </fieldset>
          </form>

          {status === "success" && (
            <p
              className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              role="status"
            >
              Thank you! Your feedback has been submitted successfully.
            </p>
          )}

          {status === "error" && (
            <p
              className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              We couldn't submit your feedback. Please try again.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

export default Testimonials;