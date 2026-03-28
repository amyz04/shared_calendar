import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarSyncCard } from "./CalendarSyncCard";
import { BestWindowsPanel } from "./BestWindowsPanel";
import { daysInMonth, firstDow } from "../../utils";

interface CalendarEmptyStateProps {
  onOpenProfile: () => void;
  isGuest: boolean;
}

export function CalendarEmptyState({
  onOpenProfile,
  isGuest,
}: CalendarEmptyStateProps) {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const days = daysInMonth(year, month);
  const fd = firstDow(year, month);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight m-0">
          Availability
        </h1>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
          {isGuest
            ? "Sign in to connect your calendar and find overlap with your group"
            : "Connect a calendar to find overlap with your group"}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_316px] gap-5 mb-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          <CalendarHeader
            month={month}
            year={year}
            subtitle="No calendar connected yet"
            dimLegend
          />
          <CalendarGrid
            days={days}
            firstDow={fd}
            renderDay={(d) => (
              <div className="aspect-square rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <span className="text-xs text-slate-400 dark:text-slate-600 font-syne">
                  {d}
                </span>
              </div>
            )}
          />
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-7 text-center flex flex-col items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                <rect x={3} y={4} width={18} height={18} rx={2} />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
              No data yet
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isGuest
                ? "Sign in to connect your calendar. Days will light up once everyone syncs."
                : "Connect your calendar to see availability. Days will light up once everyone syncs."}
            </p>
            <button
              onClick={onOpenProfile}
              className="mt-1 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold font-syne border-none cursor-pointer transition-all"
            >
              {isGuest ? "Sign in →" : "Connect calendar →"}
            </button>
          </div>

          <CalendarSyncCard members={[]} isGuest={isGuest} />
        </div>
      </div>

      <BestWindowsPanel
        windows={[]}
        month={month}
        onSetupCalendar={!isGuest ? onOpenProfile : undefined}
        isEmpty
      />
    </div>
  );
}
