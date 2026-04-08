import type { Trip } from "../../types";
import { Pill } from "../ui";
import { MONTHS } from "../../data";
import { useNavigate } from "react-router-dom";

interface TripsPageProps {
  trips: Trip[];
  onSelectTrip: (id: string) => void;
  onNewTrip: () => void;
  isGuest: boolean;
}

export function TripsPage({
  trips,
  onSelectTrip,
  onNewTrip,
  isGuest,
}: TripsPageProps) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight m-0">
            My Trips
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            {isGuest
              ? "Sign in to see your trips"
              : `${trips.length} trip${trips.length !== 1 ? "s" : ""} planned`}
          </p>
        </div>
        {!isGuest && (
          <button
            onClick={onNewTrip}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-[13px] font-semibold font-syne border-none cursor-pointer transition-all"
          >
            <svg
              width={13}
              height={13}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New trip
          </button>
        )}
      </div>

      {isGuest ? (
        <div className="max-w-sm">
          <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-7 py-12 text-center flex flex-col items-center gap-2.5">
            <div className="w-13 h-13 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
              <svg
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                className="text-slate-400"
              >
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
              No trips yet
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sign in to create trips and find the best dates for your group.
            </p>
            <span className="text-[11px] text-slate-400 dark:text-slate-600 font-syne">
              Guest mode · read only
            </span>
          </div>
        </div>
      ) : trips.length === 0 ? (
        /* Empty state for logged in user with no trips */
        <div className="max-w-sm">
          <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-7 py-12 text-center flex flex-col items-center gap-2.5">
            <div className="w-13 h-13 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
              <svg
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                className="text-slate-400"
              >
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
              No trips yet
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Create your first trip and invite friends to plan together.
            </p>
            <button
              onClick={onNewTrip}
              className="mt-1 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold font-syne border-none cursor-pointer transition-all"
            >
              Plan a trip
            </button>
          </div>
        </div>
      ) : (
        /* Trip list */
        <div className="max-w-sm">
          {trips.map((t, idx) => (
            <div key={t.id} className={idx > 0 ? "mt-3" : ""}>
              <div
                onClick={() => {
                  onSelectTrip(t.id);
                  navigate("/calendar");
                }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:border-violet-500/60"
              >
                <div className="h-1 bg-teal-400/50 border-b border-teal-400/30" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3.5">
                    <div className="text-4xl leading-none">{t.cover}</div>
                    <Pill color="#2dd4bf" dot>
                      {t.status}
                    </Pill>
                  </div>
                  <div className="mb-3.5">
                    <div className="text-[17px] font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight mb-1">
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <svg
                        width={11}
                        height={11}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx={12} cy={10} r={3} />
                      </svg>
                      {t.dest} · {MONTHS[t.month]} {t.year}
                    </div>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-700 mb-3.5" />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 dark:text-slate-600">
                      {t.memberIds.length} going
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={onNewTrip}
            className="w-full mt-3 py-3.5 rounded-2xl bg-transparent border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 text-[13px] font-syne cursor-pointer flex items-center justify-center gap-2 transition-all hover:border-violet-500 hover:text-violet-500 hover:bg-violet-500/5"
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Plan another trip
          </button>
        </div>
      )}
    </div>
  );
}
