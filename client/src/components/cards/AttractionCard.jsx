import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cleanMarkdown } from "../../utils/markdown";

import SectionCard from "./SectionCard";

function AttractionCard({ content }) {
  return (
    <SectionCard
      icon="📍"
      iconClassName="bg-orange-50"
      title="Tourist Attractions"
      subtitle="Places and experiences to explore"
    >
      {content && content.trim() ? (
        <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-strong:text-slate-800 prose-li:text-slate-600">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {cleanMarkdown(content)}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Attractions will appear here.
        </p>
      )}
    </SectionCard>
  );
}

export default AttractionCard;