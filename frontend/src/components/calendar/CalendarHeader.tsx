import { MONTHS } from "../../data";

interface CalendarHeaderProps {
  month: number;
  year: number;
  subtitle: string;
  dimLegend?: boolean;
}

const LEGEND = [
  ["All free", "bg-violet-500"],
  ["Some free", "bg-teal-400"],
  ["Conflicts", "bg-red-400"],
] as const;

export function CalendarHeader({
  month,
  year,
  subtitle,
  dimLegend,
}: CalendarHeaderProps) {
  return (
    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
      <div>
        <div className="text-base font-bold text-slate-900 dark:text-slate-100 font-syne">
          {MONTHS[month]} {year}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {subtitle}
        </div>
      </div>
      <div className="flex gap-3">
        {LEGEND.map(([label, bg]) => (
          <div
            key={label}
            className={`flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 ${dimLegend ? "opacity-35" : ""}`}
          >
            <div className={`w-2.5 h-2.5 rounded-sm ${bg} opacity-80`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
