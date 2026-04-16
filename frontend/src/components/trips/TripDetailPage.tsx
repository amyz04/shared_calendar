import { useState } from "react";
import type { Trip } from "../../types";
import { Avatar, Pill } from "../ui";
import { CalendarHeader } from "../calendar/CalendarHeader";
import { CalendarGrid } from "../calendar/CalendarGrid";
import { CalendarSyncCard } from "../calendar/CalendarSyncCard";
import { BestWindowsPanel } from "../calendar/BestWindowsPanel";
import { DateProposalSection } from "./DateProposalSection";
import { ItineraryTab } from "./ItineraryTab";
import { MONTHS } from "../../data";
import { firstDow, fmtH, fmtDuration } from "../../utils";
import { useAvailability } from "../../hooks/useAvailability";
import { useTripMembers } from "../../hooks/useTripMembers";
import type { ConfirmedRange } from "./tripUtils";
import { useTrips } from "../../context/TripContext";
import { getUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tripLen, setTripLen] = useState(3);

  const { deleteTrip } = useTrips();
  const currentUser = getUser();
  const navigate = useNavigate();

  const trip = trips.find((t) => t.id === activeTripId) ?? trips[0] ?? null;
  const members = useTripMembers(trip!);
  const { cells, windows, busyEventCounts, days, syncedMemberIds } =
    useAvailability(trip!, members, tripLen);

  const isOwner = currentUser?.id === trip?.owner?.id;

  const [confirmedStartDate, setConfirmedStartDate] = useState<string | null>(
    trip.startDate ?? null,
  );
  const [confirmedEndDate, setConfirmedEndDate] = useState<string | null>(
    trip.endDate ?? null,
  );

  // check if dates are confirmed on load
  const datesConfirmed = !!confirmedStartDate && !!confirmedEndDate;

  async function confirmDeleteTrip() {
    try {
      await deleteTrip(trip!.id);
      navigate("/trips");
    } catch {
      // ignore
    } finally {
      setShowDeleteConfirm(false);
    }
  }

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

  const { year, month } = trip;
  const fd = firstDow(year, month);

  const dayStatus = (d: number) => {
    const syncedCount = syncedMemberIds.size;
    if (syncedCount === 0) return "busy";
    return cells[d].fullyFree.length === syncedCount ? "free" : "busy";
  };

  const statusColor = (s: string) => (s === "free" ? "#2dd4bf" : "#f87171");

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
      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7 w-[360px] flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center">
              <svg
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f87171"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne mb-1">
                Delete trip
              </div>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {trip.name}
                </span>
                ? This cannot be undone and will remove the trip for all
                members.
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-[13px] font-semibold font-syne bg-transparent hover:border-slate-300 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTrip}
                className="flex-1 py-2.5 rounded-lg bg-red-400 hover:bg-red-500 text-white text-[13px] font-semibold font-syne border-none cursor-pointer transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trip Header */}
      <div className="mb-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight m-0">
              {trip.name}
            </h1>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
              {trip.dest} · {MONTHS[month]} {year} · {members.length} member
              {members.length !== 1 ? "s" : ""}
            </p>
          </div>
          {isOwner && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-xs font-semibold font-syne hover:bg-red-400/20 cursor-pointer transition-all"
            >
              <svg
                width={13}
                height={13}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
              </svg>
              Delete trip
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === "itinerary" && !datesConfirmed) return;
              setActiveTab(tab.id);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold font-syne border-none transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-violet-500 shadow-sm"
                : tab.id === "itinerary" && !datesConfirmed
                  ? "bg-transparent text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : "bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
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
                            ? `${col}25`
                            : "transparent",
                        borderColor: isSel
                          ? col
                          : `${col}${st === "busy" ? "30" : "50"}`,
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
                        {data.fullyFree
                          .filter((f) => syncedMemberIds.has(f.id))
                          .slice(0, 3)
                          .map((f) => (
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
                        {data.fullyFree.filter((f) => syncedMemberIds.has(f.id))
                          .length > 3 && (
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
              {!calendarsSynced ? (
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
              ) : sel && selDay !== null ? (
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
                        of {syncedMemberIds.size} available
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
                    {sel.memberBusy
                      .filter(({ f }) => syncedMemberIds.has(f.id))
                      .map(({ f, blocks }) => (
                        <div key={f.id} className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar f={f} size={20} />
                            <span
                              style={{
                                color:
                                  blocks.length === 0 ? f.color : undefined,
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
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative mb-1.5">
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
                          {blocks.map((b, bi) => (
                            <div
                              key={bi}
                              className="flex items-center gap-1.5 ml-1 mb-0.5"
                            >
                              <div
                                style={{ backgroundColor: f.color }}
                                className="w-1 h-1 rounded-full shrink-0"
                              />
                              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-syne truncate flex-1">
                                {b.title ?? "Event"}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {fmtH(b.s)}–{fmtH(b.e)}
                              </span>
                            </div>
                          ))}
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
                              {fmtDuration(sl.e - sl.s)}
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

          <BestWindowsPanel
            windows={windows}
            month={month}
            onSetupCalendar={
              !calendarsSynced && !isGuest ? onOpenProfile : undefined
            }
            isEmpty={!calendarsSynced}
            tripLen={tripLen}
            onTripLenChange={setTripLen}
          />

          {calendarsSynced && (
            <div className="mt-6">
              <DateProposalSection
                trip={trip}
                members={members}
                onConfirmed={(start, end) => {
                  setConfirmedStartDate(start);
                  setConfirmedEndDate(end);
                }}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "itinerary" && (
        <ItineraryTab
          trip={trip}
          confirmedStartDate={confirmedStartDate}
          confirmedEndDate={confirmedEndDate}
        />
      )}
    </div>
  );
}
