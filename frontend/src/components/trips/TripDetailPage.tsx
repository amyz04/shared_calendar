import { useState } from "react";
import type { Trip, CellData } from "../../types";
import { Avatar, Pill } from "../ui";
import { CalendarHeader } from "../calendar/CalendarHeader";
import { CalendarGrid } from "../calendar/CalendarGrid";
import { CalendarSyncCard } from "../calendar/CalendarSyncCard";
import { BestWindowsPanel } from "../calendar/BestWindowsPanel";
import { CalendarEmptyState } from "../calendar/CalendarEmptyState";
import { DateProposalSection } from "./DateProposalSection";
import { ItineraryTab } from "./ItineraryTab";
import { MONTHS } from "../../data";
import { firstDow, fmtH } from "../../utils";
import { useAvailability } from "../../hooks/useAvailability";
import { useTripMembers } from "../../hooks/useTripMembers";
import type { ConfirmedRange } from "./tripUtils";

interface TripDetailPageProps {
  trips: Trip[];
  activeTripId: string | null;
  onSelectTrip: (id: string) => void;
  onOpenProfile: () => void;
  calendarsSynced: boolean;
  isGuest: boolean;
}

export function TripDetailPage({
  trips,
  activeTripId,
  onSelectTrip,
  onOpenProfile,
  calendarsSynced,
  isGuest,
}: TripDetailPageProps) {
  const [activeTab, setActiveTab] = useState<"availability" | "itinerary">(
    "availability",
  );
  const [confirmedRange, setConfirmedRange] = useState<ConfirmedRange | null>(
    null,
  );
  const [selDay, setSelDay] = useState<number | null>(null);

  const trip = trips.find((t) => t.id === activeTripId) ?? trips[0] ?? null;

  const members = useTripMembers(trip!);
  const { cells, windows, busyEventCounts, days } = useAvailability(
    trip!,
    members,
  );

  if (!trip) {
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
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne mb-2">
          No trip selected
        </div>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
          Create a trip first then come back here to check availability.
        </p>
      </div>
    );
  }

  if (!calendarsSynced) {
    return (
      <CalendarEmptyState onOpenProfile={onOpenProfile} isGuest={isGuest} />
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

  const TABS = [
    {
      id: "availability" as const,
      label: "Availability",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      id: "itinerary" as const,
      label: "Trip",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    },
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[22px] font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight m-0">
          {trip.name}
        </h1>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
          {trip.dest} · {MONTHS[month]} {year} · {members.length} member
          {members.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold font-syne border-none cursor-pointer transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-violet-500 shadow-sm"
                : "bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={activeTab === tab.id ? 2 : 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "availability" && (
        <div>
          <div className="flex gap-2 mb-5">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-violet-500 font-syne border bg-violet-500/10 border-violet-500/30">
              <span className="text-[13px]">{trip.cover}</span>
              {trip.name}
              <span className="text-[11px] bg-violet-500/20 px-1.5 py-0.5 rounded-full">
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
                              background: isSel
                                ? "rgba(255,255,255,0.7)"
                                : f.color,
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
                            <span className="text-[10px] text-slate-400">
                              {blocks.length} event
                              {blocks.length > 1 ? "s" : ""}
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
                            <span className="text-[11px] text-slate-500 ml-auto">
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

          <div className="mt-6">
            <DateProposalSection
              trip={trip}
              members={members}
              onConfirm={(range) => {
                setConfirmedRange(range);
                setActiveTab("itinerary");
              }}
            />
          </div>
        </div>
      )}

      {activeTab === "itinerary" && (
        <ItineraryTab trip={trip} confirmedRange={confirmedRange} />
      )}
    </div>
  );
}
