import { useState } from "react";
import type { Trip } from "../../types";
import { MONTHS } from "../../data";
import { getUser } from "../../api/auth";
import { AddEventModal } from "./AddEventModal";
import type { EventItem, ItineraryDay, ConfirmedRange } from "./tripUtils";
import { getDatesInRange, fmtDate, fmtShortDate } from "./tripUtils";

interface ItineraryTabProps {
  trip: Trip;
  confirmedRange: ConfirmedRange | null;
}

export function ItineraryTab({ trip, confirmedRange }: ItineraryTabProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);

  const dates = confirmedRange
    ? getDatesInRange(confirmedRange.start, confirmedRange.end)
    : [];
  const sel = selectedDate ?? dates[0] ?? null;
  const dayEvents = sel
    ? (itinerary.find((d) => d.date === sel)?.events ?? []).sort((a, b) =>
        a.time.localeCompare(b.time),
      )
    : [];

  function addEvent(date: string, e: Omit<EventItem, "id" | "createdBy">) {
    const user = getUser();
    const newEvent: EventItem = {
      ...e,
      id: crypto.randomUUID(),
      createdBy: user ? `${user.firstName} ${user.lastName}` : "You",
    };
    setItinerary((prev) => {
      const existing = prev.find((d) => d.date === date);
      if (existing)
        return prev.map((d) =>
          d.date === date ? { ...d, events: [...d.events, newEvent] } : d,
        );
      return [...prev, { date, events: [newEvent] }];
    });
  }

  if (!confirmedRange) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
          <svg
            width={24}
            height={24}
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
        <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne mb-2">
          No dates confirmed yet
        </div>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
          Propose and agree on dates in the Availability tab first, then the
          itinerary will unlock here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {showAddEvent && sel && (
        <AddEventModal
          date={sel}
          onClose={() => setShowAddEvent(false)}
          onAdd={(e) => {
            addEvent(sel, e);
            setShowAddEvent(false);
          }}
        />
      )}

      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl">{trip.cover}</span>
        <div>
          <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne">
            {trip.name} — {MONTHS[trip.month]} {trip.year}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {dates.length} days · click a date to view or add events
          </div>
        </div>
      </div>

      {/* Date strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {dates.map((date) => {
          const { day, weekday, month } = fmtShortDate(date);
          const isSelected = sel === date;
          const hasEvents =
            itinerary.find((d) => d.date === date)?.events?.length ?? 0;
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center px-3 py-2.5 rounded-xl border transition-all shrink-0 min-w-[54px] ${
                isSelected
                  ? "bg-violet-500 border-violet-500"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-violet-400"
              }`}
            >
              <span
                className={`text-[10px] font-semibold font-syne tracking-wide ${isSelected ? "text-white/70" : "text-slate-400 dark:text-slate-500"}`}
              >
                {weekday}
              </span>
              <span
                className={`text-[18px] font-bold font-syne leading-tight ${isSelected ? "text-white" : "text-slate-900 dark:text-slate-100"}`}
              >
                {day}
              </span>
              <span
                className={`text-[10px] font-syne ${isSelected ? "text-white/70" : "text-slate-400 dark:text-slate-500"}`}
              >
                {month}
              </span>
              {hasEvents > 0 && (
                <div
                  className={`mt-1 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/70" : "bg-violet-500"}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Day view */}
      {sel && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne">
                {fmtDate(sel)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
              </div>
            </div>
            <button
              onClick={() => setShowAddEvent(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold font-syne border-none cursor-pointer transition-all"
            >
              <svg
                width={11}
                height={11}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add event
            </button>
          </div>

          {dayEvents.length === 0 ? (
            <div className="px-5 py-12 text-center flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  className="text-slate-400"
                >
                  <rect x={3} y={4} width={18} height={18} rx={2} />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                Nothing planned yet
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                Click "Add event" to start building out this day.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {dayEvents.map((event) => (
                <div key={event.id} className="flex gap-4 px-5 py-4">
                  <div className="w-14 shrink-0 text-right">
                    <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                      {event.time}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      –{event.endTime}
                    </div>
                  </div>
                  <div className="w-px bg-slate-200 dark:bg-slate-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                        {event.name}
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-syne font-semibold shrink-0 ${event.scope === "GROUP" ? "bg-violet-500/10 text-violet-500" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}
                      >
                        {event.scope === "GROUP" ? "Group" : "Personal"}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <svg
                          width={10}
                          height={10}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx={12} cy={10} r={3} />
                        </svg>
                        {event.location}
                      </div>
                    )}
                    {event.description && (
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {event.description}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 dark:text-slate-600 mt-1">
                      by {event.createdBy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
