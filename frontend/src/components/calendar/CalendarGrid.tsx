import { DAYS_SHORT } from "../../data";

interface CalendarGridProps {
  days: number;
  firstDow: number;
  renderDay: (day: number) => React.ReactNode;
}

export function CalendarGrid({ days, firstDow, renderDay }: CalendarGridProps) {
  return (
    <>
      <div className="grid grid-cols-7 px-3.5 pt-2.5 gap-1">
        {DAYS_SHORT.map((d, i) => (
          <div
            key={i}
            className="text-center text-[11px] font-semibold text-slate-400 dark:text-slate-600 font-syne tracking-widest py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 px-3.5 pb-3.5 pt-1 gap-1">
        {Array.from({ length: firstDow }, (_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => renderDay(i + 1))}
      </div>
    </>
  );
}
