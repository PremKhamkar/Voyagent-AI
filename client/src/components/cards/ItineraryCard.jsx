
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function getText(children) {
  if (typeof children === "string") return children;

  if (Array.isArray(children)) {
    return children.map(getText).join("");
  }

  if (children?.props?.children) {
    return getText(children.props.children);
  }

  return "";
}

function ItineraryCard({ content }) {
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
          Your personalized travel plan
        </p>

        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
          ✈️ Travel Itinerary
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your day-by-day guide, activities, expenses and travel tips.
        </p>
      </header>

      <div className="min-w-0 p-4 sm:p-7">
        {content?.trim() ? (
          <div className="space-y-4 text-base leading-7 text-slate-700 [&_a]:break-words [&_a]:font-medium [&_a]:text-sky-700 [&_a]:underline [&_strong]:font-bold [&_strong]:text-slate-950">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h3 className="mb-4 mt-7 text-2xl font-extrabold tracking-tight text-slate-950 first:mt-0">
                    {children}
                  </h3>
                ),

                h2: ({ children }) => {
                  const text = getText(children);
                  const isDay = /\bday\s*\d+/i.test(text);

                  return (
                    <h3
                      className={
                        isDay
                          ? "mb-5 mt-9 border-b border-slate-200 pb-3 text-xl font-extrabold text-slate-950 first:mt-0 sm:text-2xl"
                          : "mb-3 mt-7 text-lg font-bold text-slate-900"
                      }
                    >
                      {children}
                    </h3>
                  );
                },

                h3: ({ children }) => {
                  const text = getText(children);
                  const isPeriod =
                    /morning|afternoon|evening|night/i.test(text);

                  return (
                    <h4
                      className={
                        isPeriod
                          ? "mb-3 mt-7 flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-3 text-lg font-bold text-slate-900 first:mt-0"
                          : "mb-2 mt-5 text-base font-bold text-slate-800"
                      }
                    >
                      {children}
                    </h4>
                  );
                },

                p: ({ children }) => {
                  const text = getText(children);
                  const isTip = /travel tip|local tip/i.test(text);
                  const isCost =
                    /estimated cost|total day|total cost/i.test(text);

                  if (isTip) {
                    return (
                      <div className="my-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-base leading-7 text-amber-950">
                        <div className="mb-1 font-bold">💡 Travel tip</div>
                        <p>{children}</p>
                      </div>
                    );
                  }

                  if (isCost) {
                    return (
                      <div className="my-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-base leading-7 text-emerald-950">
                        <p className="font-bold">{children}</p>
                      </div>
                    );
                  }

                  return (
                    <p className="my-3 break-words text-base leading-7 text-slate-700">
                      {children}
                    </p>
                  );
                },

                ul: ({ children }) => (
                  <ul className="my-3 space-y-2 pl-6 marker:text-sky-600">
                    {children}
                  </ul>
                ),

                ol: ({ children }) => (
                  <ol className="my-3 list-decimal space-y-2 pl-6 marker:font-bold marker:text-sky-700">
                    {children}
                  </ol>
                ),

                li: ({ children }) => (
                  <li className="pl-1 text-base leading-7 text-slate-700">
                    {children}
                  </li>
                ),

                table: ({ children }) => (
                  <div className="my-4 max-w-full overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-full border-collapse text-left text-sm">
                      {children}
                    </table>
                  </div>
                ),

                th: ({ children }) => (
                  <th className="bg-slate-100 px-4 py-3 font-bold text-slate-800">
                    {children}
                  </th>
                ),

                td: ({ children }) => (
                  <td className="border-t border-slate-200 px-4 py-3 align-top text-slate-700">
                    {children}
                  </td>
                ),

                hr: () => (
                  <hr className="my-7 border-slate-200" />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="rounded-xl bg-slate-50 p-5 text-base text-slate-500">
            Your AI-generated itinerary will appear here.
          </p>
        )}
      </div>
    </section>
  );
}

export default ItineraryCard;
