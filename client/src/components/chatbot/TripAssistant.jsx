import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function TripAssistant({
  trip,
  itinerary,
  weatherInfo,
  budgetPlan,
  destinationPlan,
  accommodationPlan,
  onItineraryUpdate,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! 👋 I'm your Voyagent AI Trip Assistant. Tell me what you'd like to change or know about your current trip.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSend() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    if (!trip || !itinerary) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedMessage,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmedMessage,
            trip,
            itinerary,
            weather_info: weatherInfo,
            budget_plan: budgetPlan,
            destination_plan: destinationPlan,
            accommodation_plan: accommodationPlan,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "The AI assistant could not process your request."
        );
      }

      const assistantReply =
        data.reply ||
        "I've processed your request.";

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: assistantReply,
        },
      ]);

      if (
        data.type === "modification" &&
        data.updated_itinerary
      ) {
        onItineraryUpdate(
          data.updated_itinerary
        );
      }
    } catch (error) {
      console.error(
        "Trip Assistant Error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 2,
          role: "assistant",
          content:
            "Sorry, I couldn't process that request right now. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">

        {!isOpen ? (
          <motion.button
            key="chat-button"
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{
              opacity: 0,
              scale: 0.7,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.7,
              y: 20,
            }}
            whileHover={{
              scale: 1.06,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-gradient-to-r
              from-teal-500
              to-blue-600
              text-2xl
              text-white
              shadow-[0_10px_35px_rgba(8,145,178,0.35)]
            "
            aria-label="Open AI Trip Assistant"
          >
            ✨
          </motion.button>
        ) : (
          <motion.div
            key="chat-window"
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 25,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 25,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              flex
              h-[min(620px,calc(100vh-48px))]
              w-[min(390px,calc(100vw-32px))]
              flex-col
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-[0_20px_60px_rgba(15,23,42,0.25)]
            "
          >

            {/* Header */}

            <div
              className="
                flex
                items-center
                justify-between
                bg-gradient-to-r
                from-teal-500
                to-blue-600
                px-5
                py-4
                text-white
              "
            >
              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/20
                    text-lg
                  "
                >
                  ✨
                </div>

                <div>
                  <h3 className="font-semibold">
                    AI Trip Assistant
                  </h3>

                  <p className="text-xs text-white/80">
                    {trip?.destination
                      ? `Planning ${trip.destination}`
                      : "Your travel companion"}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsOpen(false)
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-lg
                  transition
                  hover:bg-white/15
                "
                aria-label="Close AI Trip Assistant"
              >
                ×
              </button>
            </div>

            {/* Context */}

            {trip?.destination && (
              <div
                className="
                  border-b
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-2.5
                  text-xs
                  text-slate-500
                "
              >
                📍 {trip.sourceCity} →{" "}
                <span className="font-medium text-slate-700">
                  {trip.destination}
                </span>
              </div>
            )}

            {/* Messages */}

            <div
              className="
                flex-1
                space-y-4
                overflow-y-auto
                bg-slate-50
                px-4
                py-4
              "
            >
              {messages.map((item) => {
                const isUser =
                  item.role === "user";

                return (
                  <div
                    key={item.id}
                    className={`flex ${
                      isUser
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`
                        max-w-[85%]
                        rounded-2xl
                        px-4
                        py-3
                        text-sm
                        leading-6
                        ${
                          isUser
                            ? "rounded-br-md bg-gradient-to-r from-teal-500 to-blue-600 text-white"
                            : item.error
                            ? "rounded-bl-md border border-red-200 bg-red-50 text-red-600"
                            : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                        }
                      `}
                    >
                      {isUser ? (
                        item.content
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[
                            remarkGfm,
                          ]}
                          components={{
                            p: ({ children }) => (
                              <p className="mb-1 last:mb-0">
                                {children}
                              </p>
                            ),
                            strong: ({
                              children,
                            }) => (
                              <strong className="font-semibold text-slate-800">
                                {children}
                              </strong>
                            ),
                            ul: ({
                              children,
                            }) => (
                              <ul className="ml-4 list-disc">
                                {children}
                              </ul>
                            ),
                          }}
                        >
                          {item.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading */}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="
                      rounded-2xl
                      rounded-bl-md
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      shadow-sm
                    "
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500" />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-teal-500"
                        style={{
                          animationDelay:
                            "120ms",
                        }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-teal-500"
                        style={{
                          animationDelay:
                            "240ms",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}

            <div
              className="
                border-t
                border-slate-200
                bg-white
                p-3
              "
            >
              <div
                className="
                  flex
                  items-end
                  gap-2
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-2
                  transition
                  focus-within:border-teal-400
                  focus-within:ring-2
                  focus-within:ring-teal-100
                "
              >
                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  rows={1}
                  placeholder={
                    trip?.destination
                      ? "Ask me to modify your trip..."
                      : "Generate a trip first..."
                  }
                  className="
                    max-h-24
                    min-h-[42px]
                    flex-1
                    resize-none
                    bg-transparent
                    px-2
                    py-2
                    text-sm
                    text-slate-700
                    outline-none
                    placeholder:text-slate-400
                    disabled:cursor-not-allowed
                  "
                />

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={
                    loading ||
                    !message.trim() ||
                    !trip ||
                    !itinerary
                  }
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-gradient-to-r
                    from-teal-500
                    to-blue-600
                    text-white
                    shadow-sm
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-md
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                  aria-label="Send message"
                >
                  ➤
                </button>
              </div>

              <p className="mt-2 text-center text-[10px] text-slate-400">
                AI can modify your current itinerary based on your request.
              </p>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default TripAssistant;