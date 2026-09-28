import { Children } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BR_MARKER = "@@BR@@";

// The AI sometimes puts <br> tags inside table cells. Markdown renders
// those as literal text, so swap them for a marker and turn the marker
// into real line breaks when rendering.
function prepareContent(raw) {
  return raw.replace(/<br\s*\/?>/gi, BR_MARKER);
}

function withLineBreaks(children) {
  return Children.map(children, (child) => {
    if (typeof child !== "string") {
      return child;
    }

    const parts = child.split(BR_MARKER);

    if (parts.length === 1) {
      return child;
    }

    return parts.map((part, index) => (
      <span key={index}>
        {index > 0 && <br />}
        {part}
      </span>
    ));
  });
}

const markdownComponents = {
  h2: ({ children }) => (
    <div className="mb-4 mt-8 flex items-center gap-3 first:mt-0">
      <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-indigo-600" />
      <h3 className="text-lg font-bold text-slate-900">{children}</h3>
    </div>
  ),

  h3: ({ children }) => (
    <h4 className="mb-2 mt-5 text-base font-bold text-slate-800">
      {children}
    </h4>
  ),

  p: ({ children }) => (
    <p className="mb-3 text-sm leading-6 text-slate-600">
      {withLineBreaks(children)}
    </p>
  ),

  strong: ({ children }) => (
    <strong className="font-semibold text-slate-800">{children}</strong>
  ),

  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-sm text-slate-600">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="leading-6">{withLineBreaks(children)}</li>
  ),

  blockquote: ({ children }) => (
    <div className="my-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
      {children}
    </div>
  ),

  hr: () => null,

  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-slate-50">{children}</thead>
  ),

  tbody: ({ children }) => (
    <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>
  ),

  th: ({ children }) => (
    <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="min-w-[150px] px-4 py-3 align-top leading-6 text-slate-600">
      {withLineBreaks(children)}
    </td>
  ),
};

function AccommodationCard({ content }) {
  const hasContent = content && content.trim();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-slate-800">
          🏨 Accommodation
        </h2>

        {hasContent && (
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
            ✨ AI-suggested
          </span>
        )}
      </div>

      {hasContent ? (
        <div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {prepareContent(content)}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-slate-500">
          Hotel recommendations will appear here.
        </p>
      )}
    </div>
  );
}

export default AccommodationCard;