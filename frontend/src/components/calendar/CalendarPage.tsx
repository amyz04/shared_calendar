import { useState } from "react";
import type { Trip } from "../../types";
import { CalendarEmptyState } from "./CalendarEmptyState";
import { useAvailability } from "../../hooks/useAvailability";
import { useTripMembers } from "../../hooks/useTripMembers";
import { Avatar, Pill } from "../ui";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarSyncCard } from "./CalendarSyncCard";
import { BestWindowsPanel } from "./BestWindowsPanel";
import { MONTHS } from "../../data";
import { firstDow, fmtH } from "../../utils";

interface CalendarPageProps {
  trips: Trip[];
  activeTripId: string | null;
  onSelectTrip: (id: string) => void;
  onOpenProfile: () => void;
  calendarsSynced: boolean;
  isGuest: boolean;
}

export function CalendarPage({
  trips,
  activeTripId,
  onOpenProfile,
  calendarsSynced,
  isGuest,
}: CalendarPageProps) {
  const [selDay, setSelDay] = useState<number | null>(null);

  const trip = trips.find((t) => t.id === activeTripId) ?? trips[0] ?? null;
  const members = useTripMembers(trip);
  const { cells, windows, busyEventCounts, days, loading } = useAvailability(
    trip,
    members,
  );

  if (!calendarsSynced) {
    return (
      <CalendarEmptyState onOpenProfile={onOpenProfile} isGuest={isGuest} />
    );
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne mb-2">
          No trip selected
        </div>
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
          Create a trip first then come back here.
        </p>
      </div>
    );
  }

  const { year, month } = trip;
  const fd = firstDow(year, month);

  const dayStatus = (d: number) => {
    const r = cells[d].fullyFree.length / members.length;
    return r === 1 ? "free" : r >= 0.5 ? "partial" : "busy";
  };

  const statusColor = (s: string) =>
    s === "free" ? "#8b5cf6" : s === "partial" ? "#2dd4bf" : "#f87171";

  const sel = selDay !== null ? cells[selDay] : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight m-0">
          Availability
        </h1>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
          Finding overlap for {trip.name}
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-[12px] text-slate-400 font-syne mb-4">
          <div className="w-3 h-3 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          Loading your calendar events...
        </div>
      )}

      <div className="flex gap-2 mb-5">
        <div
          style={{ backgroundColor: "#8b5cf620", borderColor: "#8b5cf650" }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-violet-500 font-syne border"
        >
          <span className="text-[13px]">{trip.cover}</span>
          {trip.name}
          <span
            style={{ backgroundColor: "#8b5cf620" }}
            className="text-[11px] px-1.5 py-0.5 rounded-full"
          >
            {members.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_316px] gap-5 mb-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          <CalendarHeader
            month={month}
            year={year}
            subtitle={`${members.length} member${members.length !== 1 ? "s" : ""} · click a day to inspect`}
          />
          <CalendarGrid
            days={days}
            firstDow={fd}
            renderDay={(d) => {
              const st = dayStatus(d);
              const col = statusColor(st);
              const isSel = selDay === d;
              const data = cells[d];
              return (
                <button
                  key={d}
                  onClick={() => setSelDay(isSel ? null : d)}
                  style={{
                    background: isSel
                      ? col
                      : st === "free"
                        ? `${col}18`
                        : st === "partial"
                          ? `${col}10`
                          : "transparent",
                    borderColor: isSel
                      ? col
                      : `${col}${st === "busy" ? "30" : "40"}`,
                  }}
                  className="aspect-square rounded-lg cursor-pointer border flex flex-col items-center justify-center gap-0.5 transition-all hover:opacity-90"
                >
                  <span
                    style={{ color: isSel ? "#fff" : undefined }}
                    className={`text-xs font-syne leading-none ${isSel ? "font-bold" : st === "free" ? "font-semibold text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}
                  >
                    {d}
                  </span>
                  <div className="flex gap-0.5">
                    {data.fullyFree.slice(0, 3).map((f) => (
                      <div
                        key={f.id}
                        style={{
                          background: isSel ? "rgba(255,255,255,0.7)" : f.color,
                        }}
                        className="w-1 h-1 rounded-full"
                      />
                    ))}
                    {data.fullyFree.length > 3 && (
                      <div
                        style={{
                          background: isSel
                            ? "rgba(255,255,255,0.4)"
                            : undefined,
                        }}
                        className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600"
                      />
                    )}
                  </div>
                </button>
              );
            }}
          />
        </div>

        <div className="flex flex-col gap-3.5">
          {sel && selDay !== null ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne">
                    {MONTHS[month].slice(0, 3)} {selDay}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="text-violet-500 font-semibold">
                      {sel.fullyFree.length}
                    </span>{" "}
                    of {members.length} available
                  </div>
                </div>
                {sel.freeSlots.length > 0 && (
                  <Pill color="#8b5cf6">
                    {sel.freeSlots.length} window
                    {sel.freeSlots.length > 1 ? "s" : ""}
                  </Pill>
                )}
              </div>
              <div className="p-4">
                {sel.memberBusy.map(({ f, blocks }) => (
                  <div key={f.id} className="mb-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar f={f} size={20} />
                      <span
                        style={{
                          color: blocks.length === 0 ? f.color : undefined,
                        }}
                        className={`text-xs flex-1 font-syne ${blocks.length === 0 ? "font-semibold" : "text-slate-500 dark:text-slate-400"}`}
                      >
                        {f.name.split(" ")[0]}
                      </span>
                      {blocks.length === 0 ? (
                        <Pill color={f.color} dot>
                          free
                        </Pill>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-600">
                          {blocks.length} event{blocks.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
                      {blocks.length === 0 ? (
                        <div
                          style={{ backgroundColor: `${f.color}30` }}
                          className="absolute inset-0 rounded-full"
                        />
                      ) : (
                        blocks.map((b, bi) => {
                          const tot = 10;
                          const l = ((b.s - 8) / tot) * 100;
                          const w = ((b.e - b.s) / tot) * 100;
                          return (
                            <div
                              key={bi}
                              style={{
                                left: `${l}%`,
                                width: `${w}%`,
                                backgroundColor: `${f.color}60`,
                              }}
                              className="absolute h-full rounded-sm"
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
                {sel.freeSlots.length > 0 && (
                  <div className="px-3.5 py-3 rounded-xl bg-violet-500/5 border border-violet-500/20 mt-1">
                    <div className="text-[10px] font-bold text-violet-500 tracking-widest font-syne mb-2">
                      SHARED FREE WINDOWS
                    </div>
                    {sel.freeSlots.map((sl, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 ${i < sel.freeSlots.length - 1 ? "mb-1.5" : ""}`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                        <span className="text-xs text-violet-500 font-medium">
                          {fmtH(sl.s)} – {fmtH(sl.e)}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-auto">
                          {sl.e - sl.s}h
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
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
                Select a day
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Click any date to see who's free and shared time windows
              </p>
            </div>
          )}
          <CalendarSyncCard
            members={members}
            busyEventCounts={busyEventCounts}
          />
        </div>
      </div>

      <BestWindowsPanel windows={windows} month={month} />
    </div>
  );
}
