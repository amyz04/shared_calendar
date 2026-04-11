import type { Trip } from "../../types";
import { MONTHS } from "../../data";
import { useNavigate } from "react-router-dom";

interface SidebarTripsProps {
  trips: Trip[];
  activeTripId: string | null;
  onSelectTrip: (id: string) => void;
  onNewTrip: () => void;
  isGuest: boolean;
}

export function SidebarTrips({
  trips,
  activeTripId,
  onSelectTrip,
  onNewTrip,
  isGuest,
}: SidebarTripsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto px-2.5 py-1.5">
      <div className="flex items-center justify-between px-2 mb-1.5">
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne">
          TRIPS
        </span>
        {!isGuest && (
          <button
            onClick={onNewTrip}
            className="text-base text-slate-400 dark:text-slate-600 bg-transparent border-none cursor-pointer leading-none hover:text-violet-500 transition-colors"
          >
            +
          </button>
        )}
      </div>

      {isGuest ? (
        <div className="px-2 py-4 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
          <span className="text-[11px] text-slate-400 dark:text-slate-600 font-syne leading-relaxed">
            Sign in to see your trips
          </span>
        </div>
      ) : (
        <>
          {trips.length === 0 && (
            <div className="px-2 py-4 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 mb-1">
              <span className="text-[11px] text-slate-400 dark:text-slate-600 font-syne leading-relaxed">
                No trips yet
              </span>
            </div>
          )}
          {trips.map((t) => {
            const on = activeTripId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTrip(t.id);
                  navigate("/calendar");
                }}
                className={`w-full px-2.5 py-2 rounded-lg mb-0.5 cursor-pointer text-left border transition-all
                  ${
                    on
                      ? "bg-violet-500/10 border-violet-500/30"
                      : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[15px]">{t.cover}</span>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs font-semibold truncate font-syne ${on ? "text-violet-500" : "text-slate-900 dark:text-slate-100"}`}
                    >
                      {t.name}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-600 mt-0.5">
                      {MONTHS[t.month].slice(0, 3)} {t.year}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          <button
            onClick={onNewTrip}
            className="w-full mt-1 py-1.5 px-2.5 rounded-lg bg-transparent border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 text-xs font-syne cursor-pointer transition-all hover:border-violet-500 hover:text-violet-500"
          >
            + New trip
          </button>
        </>
      )}
    </div>
  );
}
