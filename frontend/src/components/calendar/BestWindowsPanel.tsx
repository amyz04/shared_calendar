import { MONTHS } from "../../data";
import { Pill } from "../ui";

interface Window {
  start: number;
  end: number;
  len: number;
  score: number;
  count: number;
  total: number;
  freeNames: string[];
  conflicts: string[];
}

interface BestWindowsPanelProps {
  windows: Window[];
  month: number;
  onSetupCalendar?: () => void;
  isEmpty?: boolean;
  tripLen: number;
  onTripLenChange: (len: number) => void;
}

const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 10, 14];

export function BestWindowsPanel({
  windows,
  month,
  onSetupCalendar,
  isEmpty,
  tripLen,
  onTripLenChange,
}: BestWindowsPanelProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-syne">
            Best availability windows
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isEmpty
              ? "Computed once all members sync their calendars"
              : "Ranked by group overlap"}
          </div>
        </div>

        {!isEmpty && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-syne whitespace-nowrap">
              Trip length
            </span>
            <select
              value={tripLen}
              onChange={(e) => onTripLenChange(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold font-syne border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 cursor-pointer outline-none focus:border-violet-500 transition-colors"
            >
              {DAY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d} day{d !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {isEmpty ? (
        <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
          <div className="flex gap-2.5 w-full max-w-md">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{ opacity: 0.5 + i * 0.1 }}
                className="flex-1 h-20 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-dashed border-slate-200 dark:border-slate-700"
              />
            ))}
          </div>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
            We'll automatically find the best dates once your group connects their calendars.
          </p>
          {onSetupCalendar && (
            <button
              onClick={onSetupCalendar}
              className="px-5 py-2 rounded-lg bg-transparent border border-violet-500 text-violet-500 text-xs font-semibold font-syne cursor-pointer hover:bg-violet-500/10 transition-all"
            >
              Set up your calendar
            </button>
          )}
        </div>
      ) : windows.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne mb-1">
            No windows found
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No {tripLen}-day stretch where enough members are free. Try a shorter trip length.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {windows.map((w, i) => {
            const col = w.score >= 90 ? "#2dd4bf" : w.score >= 70 ? "#8b5cf6" : "#f59e0b";
            const isTop = i === 0;
            return (
              <div
                key={i}
                className={`px-5 py-4 relative
                  ${i % 3 < 2 ? "border-r border-slate-200 dark:border-slate-700" : ""}
                  ${i < 3 ? "border-b border-slate-200 dark:border-slate-700" : ""}
                  ${isTop ? "bg-violet-500/5" : ""}
                `}
              >
                {isTop && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500" />
                )}
                <div className="flex items-start justify-between mb-2.5">
                  <div>
                    {isTop && (
                      <div className="text-[9px] font-bold text-violet-500 tracking-widest font-syne mb-1">
                        BEST MATCH
                      </div>
                    )}
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-syne">
                      {MONTHS[month].slice(0, 3)} {w.start}–{w.end}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {w.len} day{w.len !== 1 ? "s" : ""} · {w.count}/{w.total} free
                    </div>
                  </div>
                  <div
                    style={{ backgroundColor: `${col}20`, borderColor: col, color: col }}
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold font-syne shrink-0"
                  >
                    {w.score}
                  </div>
                </div>
                <div className={`flex flex-wrap gap-1 ${w.conflicts.length > 0 ? "mb-2" : ""}`}>
                  {w.freeNames.map((n: string) => (
                    <Pill key={n} color="#8b5cf6">{n}</Pill>
                  ))}
                </div>
                {w.conflicts.length > 0 && (
                  <div className="text-[11px] text-red-400 flex items-center gap-1">
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <circle cx={12} cy={12} r={10} />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    {w.conflicts.join(", ")} unavailable
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}