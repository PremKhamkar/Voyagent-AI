import { useEffect, useState } from "react";

function AgentFlow() {
  const agents = [
    { id: 1, name: "Destination", icon: "⌖" },
    { id: 2, name: "Weather", icon: "☁" },
    { id: 3, name: "Budget", icon: "◎" },
    { id: 4, name: "Accommodation", icon: "⌂" },
    { id: 5, name: "Itinerary", icon: "▤" },
  ];

  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((previous) => {
        if (previous < agents.length - 1) {
          return previous + 1;
        }

        return previous;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [agents.length]);

  const logs = [
    "Destination Agent — Understanding your destination and travel preferences...",
    "Weather Agent — Checking weather conditions for your travel dates...",
    "Budget Agent — Building a budget plan for your trip...",
    "Accommodation Agent — Evaluating accommodation options...",
    "Itinerary Agent — Assembling your day-by-day travel plan...",
  ];

  return (
    <div
      className="
        mt-6
        overflow-hidden
        rounded-2xl
        border
        border-slate-700
        bg-[#102a35]
        shadow-sm
      "
    >
      {/* Agent Pipeline */}

      <div className="px-6 py-8 md:px-10">
        <div className="relative mx-auto max-w-6xl">

          {/* Connection Lines */}

          <div
            className="
              pointer-events-none
              absolute
              left-[10%]
              right-[10%]
              top-[48px]
              hidden
              h-[90px]
              md:block
            "
          >
            <svg
              viewBox="0 0 1000 150"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              {agents.slice(0, -1).map((_, index) => {
                const x1 = 100 + index * 200;
                const x2 = 300 + index * 200;

                const y1 =
                  index % 2 === 0 ? 65 : 125;

                const y2 =
                  index % 2 === 0 ? 125 : 65;

                const isCompleted =
                  activeAgent > index;

                return (
                  <line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={
                      isCompleted
                        ? "#2dd4bf"
                        : "#155e75"
                    }
                    strokeWidth="2"
                    strokeDasharray="6 8"
                    className="transition-all duration-700"
                  />
                );
              })}
            </svg>
          </div>

          {/* Desktop Agents */}

          <div className="relative hidden min-h-[145px] items-start justify-between md:flex">
            {agents.map((agent, index) => {
              const isActive =
                activeAgent === index;

              const isCompleted =
                activeAgent > index;

              const isHighlighted =
                isActive || isCompleted;

              return (
                <div
                  key={agent.id}
                  className="relative z-10 flex w-[130px] flex-col items-center"
                  style={{
                    marginTop:
                      index % 2 === 0
                        ? "5px"
                        : "55px",
                  }}
                >
                  {/* Agent Circle */}

                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      text-lg
                      transition-all
                      duration-500
                      ${
                        isActive
                          ? "scale-125 border-cyan-300 bg-cyan-500/20 text-white shadow-[0_0_25px_rgba(45,212,191,0.45)]"
                          : isCompleted
                          ? "border-teal-400 bg-teal-500/10 text-teal-300"
                          : "border-teal-500/70 bg-[#102a35] text-slate-300"
                      }
                    `}
                  >
                    {agent.icon}
                  </div>

                  {/* Active Pulse */}

                  {isActive && (
                    <span
                      className="
                        absolute
                        top-0
                        h-12
                        w-12
                        animate-ping
                        rounded-full
                        border
                        border-cyan-400/40
                      "
                    />
                  )}

                  {/* Label */}

                  <p
                    className={`
                      mt-3
                      whitespace-nowrap
                      text-center
                      font-mono
                      text-xs
                      font-medium
                      transition-colors
                      duration-500
                      ${
                        isHighlighted
                          ? "text-white"
                          : "text-slate-400"
                      }
                    `}
                  >
                    {agent.id}. {agent.name}
                  </p>

                  {/* Status */}

                  <p className="mt-1 text-[10px] text-teal-300">
                    {isActive
                      ? "Working..."
                      : isCompleted
                      ? "Complete"
                      : "Waiting"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile Agents */}

          <div className="grid grid-cols-2 gap-5 md:hidden">
            {agents.map((agent, index) => {
              const isActive =
                activeAgent === index;

              const isCompleted =
                activeAgent > index;

              return (
                <div
                  key={agent.id}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      ${
                        isActive
                          ? "border-cyan-300 bg-cyan-500/20 text-white"
                          : isCompleted
                          ? "border-teal-400 text-teal-300"
                          : "border-teal-500/60 text-slate-300"
                      }
                    `}
                  >
                    {agent.icon}
                  </div>

                  <div>
                    <p className="font-mono text-xs text-white">
                      {agent.id}. {agent.name}
                    </p>

                    <p className="text-[10px] text-teal-300">
                      {isActive
                        ? "Working..."
                        : isCompleted
                        ? "Complete"
                        : "Waiting"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orchestrator Log */}

      <div className="border-t border-slate-700 bg-[#071923]">
        <div className="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
          <span
            className="
              h-2
              w-2
              animate-pulse
              rounded-full
              bg-teal-400
            "
          />

          <span className="font-mono text-xs tracking-widest text-slate-400">
            ORCHESTRATOR LOG
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto px-4 py-3">
          {logs.map((log, index) => {
            const isActive =
              activeAgent === index;

            const isCompleted =
              activeAgent > index;

            return (
              <div
                key={log}
                className={`
                  mb-3
                  font-mono
                  text-xs
                  transition-all
                  duration-500
                  ${
                    isActive
                      ? "text-white"
                      : isCompleted
                      ? "text-slate-300"
                      : "text-slate-600"
                  }
                `}
              >
                <span
                  className={
                    isActive || isCompleted
                      ? "text-teal-400"
                      : "text-slate-600"
                  }
                >
                  {isCompleted
                    ? "OK"
                    : isActive
                    ? "→"
                    : "○"}
                </span>{" "}
                <span>{log}</span>

                {isCompleted && index < logs.length - 1 && (
                  <div className="mt-1 pl-5 text-[11px] text-teal-400/80">
                    OK {agents[index].name} Agent handed off its output to{" "}
                    {agents[index + 1].name} Agent
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AgentFlow;