import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function WeatherCard({ content }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-slate-800">
        🌦️ Weather Information
      </h2>

      {content && content.trim() ? (
        <div className="prose max-w-none prose-p:text-slate-600 prose-strong:text-slate-800 prose-li:text-slate-600 prose-headings:text-slate-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-slate-500">
          Weather information will appear here.
        </p>
      )}
    </div>
  );
}

export default WeatherCard;