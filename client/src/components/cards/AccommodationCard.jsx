import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cleanMarkdown } from "../../utils/markdown";

import SectionCard from "./SectionCard";

function AccommodationCard({ content }) {
  return (
    <SectionCard
      icon="🏨"
      iconClassName="bg-purple-50"
      title="Accommodation"
      subtitle="Where to stay and what to expect"
    >
      {content && content.trim() ? (
        <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-strong:text-slate-800 prose-li:text-slate-600 prose-table:text-slate-600">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {cleanMarkdown(content)}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Hotel recommendations will appear here.
        </p>
      )}
    </SectionCard>
  );
}

export default AccommodationCard;