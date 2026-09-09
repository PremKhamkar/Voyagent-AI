import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ItineraryCard({ content }) {
  return (
    <div className="rounded-3xl bg-slate-800 p-6">
      <h2 className="mb-4 text-2xl font-bold">
        ✈️ Travel Itinerary
      </h2>

      {content ? (
        <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-li:text-gray-200 prose-table:text-gray-200">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-gray-300">
          Your AI-generated itinerary will appear here.
        </p>
      )}
    </div>
  );
}

export default ItineraryCard;