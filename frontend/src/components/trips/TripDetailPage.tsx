import { useState, useMemo } from "react";
import type { Trip, Friend, BusyMap, CellData } from "../../types";
import { Avatar, Pill } from "../ui";
import { CalendarHeader } from "../calendar/CalendarHeader";
import { CalendarGrid } from "../calendar/CalendarGrid";
import { CalendarSyncCard } from "../calendar/CalendarSyncCard";
import { BestWindowsPanel } from "../calendar/BestWindowsPanel";
import { CalendarEmptyState } from "../calendar/CalendarEmptyState";
import { DateProposalSection } from "./DateProposalSection";
import { ItineraryTab } from "./ItineraryTab";
import { FRIENDS, MONTHS } from "../../data";
import { daysInMonth, firstDow, fmtH, genBusy, getFreeSlots, computeWindows } from "../../utils";
import type { ConfirmedRange } from "./tripUtils";

interface TripDetailPageProps {
  trips: Trip[];
  activeTripId: number;
  onSelectTrip: (id: number) => void;
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
  const [activeTab, setActiveTab] = useState<"availability" | "itinerary">("availability");
  const [confirmedRange, setConfirmedRange] = useState<ConfirmedRange | null>(null);
  const [selDay, setSelDay] = useState<number | null>(null);

  const trip = trips.find(t => t.id === activeTripId) || trips[0];
  const members = trip.memberIds.map(id => FRIENDS.find(f => f.id === id)).filter(Boolean) as Friend[];
  const { year, month } = trip;
  const days = daysInMonth(year, month);
  const fd = firstDow(year, month);

  const allBusy = useMemo<BusyMap>(() => {
    const out: BusyMap = {};
    members.forEach(f => { out[f.id] = genBusy(f.id * 31 + trip.id * 7, year, month); });
    return out;
  }, [trip.id]);

  const cells = useMemo(() => {
    const out: { [d: number]: CellData } = {};
    for (let d = 1; d <= days; d++) {
      const mb = members.map(f => ({ f, blocks: allBusy[f.id]?.[d] || [] }));
      const ab = mb.flatMap(x => x.blocks);
      out[d] = { memberBusy: mb, freeSlots: getFreeSlots(ab), fullyFree: members.filter(f => (allBusy[f.id]?.[d] || []).length === 0) };
    }
    return out;
  }, [trip.id]);

  const windows = useMemo(() => computeWindows(members, allBusy, year, month), [trip.id]);
  const dayStatus = (d: number) => { const r = cells[d].fullyFree.length / members.length; return r === 1 ? "free" : r >= 0.5 ? "partial" : "busy"; };
  const statusColor = (s: string) => s === "free" ? "#8b5cf6" : s === "partial" ? "#2dd4bf" : "#f87171";
  const sel = selDay !== null ? cells[selDay] : null;
  const busyEventCounts = Object.fromEntries(members.map(f => [f.id, Object.values(allBusy[f.id] || {}).reduce((s, b) => s + b.length, 0)]));

  const TABS = [
    { id: "availability" as const, label: "Availability", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { id: "itinerary" as const, label: "Trip", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  ];

  if (!calendarsSynced)
    return <CalendarEmptyState onOpenProfile={onOpenProfile} isGuest={isGuest} />;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[22px] font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight m-0">{trip.name}</h1>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">{trip.dest} · {MONTHS[month]} {year} · {members.length} members</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 w-fit">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold font-syne border-none cursor-pointer transition-all ${
              activeTab === tab.id ? "bg-white dark:bg-slate-700 text-violet-500 shadow-sm" : "bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === tab.id ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Availability tab */}
      {activeTab === "availability" && (
        <div>
          <div className="flex gap-2 mb-5">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-violet-500 font-syne border bg-violet-500/10 border-violet-500/30">
              <span className="text-[13px]">{trip.cover}</span>
              {trip.name}
              <span className="text-[11px] bg-violet-500/20 px-1.5 py-0.5 rounded-full">{trip.memberIds.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_316px] gap-5 mb-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <CalendarHeader month={month} year={year} subtitle={`${members.length} members · click a day to inspect`} />
              <CalendarGrid days={days} firstDow={fd} renderDay={d => {
                const st = dayStatus(d); const col = statusColor(st); const isSel = selDay === d; const data = cells[d];
                return (
                  <button key={d} onClick={() => setSelDay(isSel ? null : d)}
                    style={{ background: isSel ? col : st === "free" ? `${col}18` : st === "partial" ? `${col}10` : "transparent", borderColor: isSel ? col : `${col}${st === "busy" ? "30" : "40"}` }}
                    className="aspect-square rounded-lg cursor-pointer border flex flex-col items-center justify-center gap-0.5 transition-all hover:opacity-90">
                    <span style={{ color: isSel ? "#fff" : undefined }} className={`text-xs font-syne leading-none ${isSel ? "font-bold" : st === "free" ? "font-semibold text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}>{d}</span>
                    <div className="flex gap-0.5">
                      {data.fullyFree.slice(0, 3).map(f => <div key={f.id} style={{ background: isSel ? "rgba(255,255,255,0.7)" : f.color }} className="w-1 h-1 rounded-full" />)}
                      {data.fullyFree.length > 3 && <div style={{ background: isSel ? "rgba(255,255,255,0.4)" : undefined }} className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />}
                    </div>
                  </button>
                );
              }} />
            </div>

            <div className="flex flex-col gap-3.5">
              {sel && selDay !== null ? (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne">{MONTHS[month].slice(0, 3)} {selDay}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5"><span className="text-violet-500 font-semibold">{sel.fullyFree.length}</span> of {members.length} available</div>
                    </div>
                    {sel.freeSlots.length > 0 && <Pill color="#8b5cf6">{sel.freeSlots.length} window{sel.freeSlots.length > 1 ? "s" : ""}</Pill>}
                  </div>
                  <div className="p-4">
                    {sel.memberBusy.map(({ f, blocks }) => (
                      <div key={f.id} className="mb-2.5">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar f={f} size={20} />
                          <span style={{ color: blocks.length === 0 ? f.color : undefined }} className={`text-xs flex-1 font-syne ${blocks.length === 0 ? "font-semibold" : "text-slate-500 dark:text-slate-400"}`}>{f.name.split(" ")[0]}</span>
                          {blocks.length === 0 ? <Pill color={f.color} dot>free</Pill> : <span className="text-[10px] text-slate-400">{blocks.length} event{blocks.length > 1 ? "s" : ""}</span>}
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
                          {blocks.length === 0
                            ? <div style={{ backgroundColor: `${f.color}30` }} className="absolute inset-0 rounded-full" />
                            : blocks.map((b, bi) => { const tot = 10; const l = ((b.s - 8) / tot) * 100; const w = ((b.e - b.s) / tot) * 100; return <div key={bi} style={{ left: `${l}%`, width: `${w}%`, backgroundColor: `${f.color}60` }} className="absolute h-full rounded-sm" />; })
                          }
                        </div>
                      </div>
                    ))}
                    {sel.freeSlots.length > 0 && (
                      <div className="px-3.5 py-3 rounded-xl bg-violet-500/5 border border-violet-500/20 mt-1">
                        <div className="text-[10px] font-bold text-violet-500 tracking-widest font-syne mb-2">SHARED FREE WINDOWS</div>
                        {sel.freeSlots.map((sl, i) => (
                          <div key={i} className={`flex items-center gap-2 ${i < sel.freeSlots.length - 1 ? "mb-1.5" : ""}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                            <span className="text-xs text-violet-500 font-medium">{fmtH(sl.s)} – {fmtH(sl.e)}</span>
                            <span className="text-[11px] text-slate-500 ml-auto">{sl.e - sl.s}h</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-7 text-center flex flex-col items-center gap-2.5">
                  <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth={1.8} strokeLinecap="round">
                      <rect x={3} y={4} width={18} height={18} rx={2} /><path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </div>
                  <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">Select a day</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Click any date to see who's free and shared time windows</p>
                </div>
              )}
              <CalendarSyncCard members={members} busyEventCounts={busyEventCounts} />
            </div>
          </div>

          <BestWindowsPanel windows={windows} month={month} />

          <div className="mt-6">
            <DateProposalSection
              trip={trip}
              members={members}
              onConfirm={range => { setConfirmedRange(range); setActiveTab("itinerary"); }}
            />
          </div>
        </div>
      )}

      {/* Trip tab */}
      {activeTab === "itinerary" && <ItineraryTab trip={trip} confirmedRange={confirmedRange} />}
    </div>
  );
}