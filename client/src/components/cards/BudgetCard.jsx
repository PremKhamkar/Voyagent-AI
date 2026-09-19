import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function BudgetCard({ content }) {
  const hasContent =
    typeof content === "string" &&
    content.trim();

  function getHeadingIcon(text) {
    const value = text.toLowerCase();

    if (
      value.includes("total") ||
      value.includes("estimate") ||
      value.includes("cost")
    ) {
      return "💰";
    }

    if (
      value.includes("travel") ||
      value.includes("transport")
    ) {
      return "🚗";
    }

    if (
      value.includes("hotel") ||
      value.includes("stay") ||
      value.includes("accommodation")
    ) {
      return "🏨";
    }

    if (
      value.includes("food") ||
      value.includes("meal")
    ) {
      return "🍛";
    }

    if (
      value.includes("activity") ||
      value.includes("activities") ||
      value.includes("attraction")
    ) {
      return "🎟️";
    }

    if (
      value.includes("buffer") ||
      value.includes("emergency") ||
      value.includes("misc")
    ) {
      return "🛟";
    }

    if (
      value.includes("saving") ||
      value.includes("save") ||
      value.includes("tip")
    ) {
      return "💡";
    }

    return "📊";
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 px-6 py-5 md:px-7">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xl text-white shadow-sm">
              💰
            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                AI Financial Planning
              </p>

              <h2 className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
                Budget Plan
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Personalized expense planning for your trip
              </p>

            </div>

          </div>

          <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 shadow-sm">
            ✨ AI Generated
          </span>

        </div>

      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-5 md:p-7">

        {!hasContent ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">

            <div className="text-4xl">
              💰
            </div>

            <h3 className="mt-3 text-lg font-bold text-slate-800">
              Budget details will appear here
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Generate a travel plan to receive your
              personalized expense breakdown.
            </p>

          </div>
        ) : (

          <div className="space-y-4">

            {/* =================================================
                AI PLAN BODY
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 md:p-6">

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{

                  /* -----------------------------------------
                     H1
                  ------------------------------------------ */

                  h1: ({ children }) => (
                    <div className="mb-5 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                          💰
                        </div>

                        <h3 className="text-lg font-black text-slate-900">
                          {children}
                        </h3>

                      </div>

                    </div>
                  ),

                  /* -----------------------------------------
                     H2
                  ------------------------------------------ */

                  h2: ({ children }) => {
                    const text = String(
                      children
                    );

                    return (
                      <div className="mt-6 mb-3 flex items-center gap-2 first:mt-0">

                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm">
                          {getHeadingIcon(text)}
                        </span>

                        <h3 className="text-base font-black text-slate-900">
                          {children}
                        </h3>

                      </div>
                    );
                  },

                  /* -----------------------------------------
                     H3
                  ------------------------------------------ */

                  h3: ({ children }) => {
                    const text = String(
                      children
                    );

                    return (
                      <div className="mt-5 mb-2.5 flex items-center gap-2">

                        <span className="text-sm">
                          {getHeadingIcon(text)}
                        </span>

                        <h4 className="text-sm font-bold text-slate-800">
                          {children}
                        </h4>

                      </div>
                    );
                  },

                  /* -----------------------------------------
                     PARAGRAPH
                  ------------------------------------------ */

                  p: ({ children }) => (
                    <p className="mb-3 text-sm leading-6 text-slate-600 last:mb-0">
                      {children}
                    </p>
                  ),

                  /* -----------------------------------------
                     STRONG / AMOUNTS
                  ------------------------------------------ */

                  strong: ({ children }) => (
                    <strong className="font-bold text-slate-900">
                      {children}
                    </strong>
                  ),

                  /* -----------------------------------------
                     UNORDERED LIST
                  ------------------------------------------ */

                  ul: ({ children }) => (
                    <ul className="mb-4 space-y-2">
                      {children}
                    </ul>
                  ),

                  /* -----------------------------------------
                     ORDERED LIST
                  ------------------------------------------ */

                  ol: ({ children }) => (
                    <ol className="mb-4 space-y-2">
                      {children}
                    </ol>
                  ),

                  /* -----------------------------------------
                     LIST ITEM
                  ------------------------------------------ */

                  li: ({ children }) => (
                    <li className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-600">

                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

                      <span>
                        {children}
                      </span>

                    </li>
                  ),

                  /* -----------------------------------------
                     BLOCKQUOTE
                  ------------------------------------------ */

                  blockquote: ({ children }) => (
                    <div className="my-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">

                      <div className="flex items-start gap-2">

                        <span className="text-lg">
                          💡
                        </span>

                        <div className="text-sm leading-6 text-amber-800">
                          {children}
                        </div>

                      </div>

                    </div>
                  ),

                  /* -----------------------------------------
                     TABLE WRAPPER
                  ------------------------------------------ */

                  table: ({ children }) => (
                    <div className="my-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">

                      <table className="min-w-full border-collapse text-sm">
                        {children}
                      </table>

                    </div>
                  ),

                  /* -----------------------------------------
                     TABLE HEAD
                  ------------------------------------------ */

                  thead: ({ children }) => (
                    <thead className="bg-slate-900 text-white">
                      {children}
                    </thead>
                  ),

                  /* -----------------------------------------
                     TABLE BODY
                  ------------------------------------------ */

                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-slate-200">
                      {children}
                    </tbody>
                  ),

                  /* -----------------------------------------
                     TABLE ROW
                  ------------------------------------------ */

                  tr: ({ children }) => (
                    <tr className="transition hover:bg-emerald-50/50">
                      {children}
                    </tr>
                  ),

                  /* -----------------------------------------
                     TABLE HEADER
                  ------------------------------------------ */

                  th: ({ children }) => (
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                      {children}
                    </th>
                  ),

                  /* -----------------------------------------
                     TABLE CELL
                  ------------------------------------------ */

                  td: ({ children }) => (
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                      {children}
                    </td>
                  ),

                  /* -----------------------------------------
                     LINKS
                  ------------------------------------------ */

                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-emerald-600 underline decoration-emerald-300 underline-offset-2 transition hover:text-emerald-700"
                    >
                      {children}
                    </a>
                  ),

                  /* -----------------------------------------
                     HORIZONTAL RULE
                  ------------------------------------------ */

                  hr: () => (
                    <div className="my-5 h-px bg-slate-200" />
                  ),

                }}
              >
                {content}
              </ReactMarkdown>

            </div>

            {/* =================================================
                FOOTER NOTE
            ================================================== */}

            <div className="flex flex-col gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">

                <span className="text-sm">
                  💡
                </span>

                <p className="text-xs font-medium text-emerald-800">
                  AI-generated estimate based on your trip
                  requirements.
                </p>

              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                Review before booking
              </span>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default BudgetCard;