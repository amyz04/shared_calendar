import { useState } from "react";
import type { Trip } from "../../types";
import { Pill } from "../ui";
import { MONTHS } from "../../data";
import { useNavigate } from "react-router-dom";
import { respondToTripApi } from "../../api/trip";
import { useTrips } from "../../context/TripContext";

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
  const { refetch } = useTrips();
  const [activeTab, setActiveTab] = useState<"mytrips" | "pending">("mytrips");


  const confirmedTrips = trips.filter((t) => {
    if (t.currentUserStatus === "REJECTED") return false;
    return (
      t.status === "CONFIRMED" ||
      (t.status === "PROPOSED" && t.isOwner) ||
      (t.status === "PROPOSED" && !t.isOwner && t.currentUserStatus === "CONFIRMED")
    );
  });

  const sentTrips = trips.filter((t) => {
    if (!t.isOwner || t.status !== "PROPOSED") return false;
    const invitedCount = t.members.length - 1;
    if (invitedCount === 0) return false;
    const respondedCount = (t.acceptedCount ?? 0) + (t.declinedCount ?? 0);
    return respondedCount < invitedCount;
  });

  const receivedTrips = trips.filter(
    (t) =>
      !t.isOwner &&
      t.status === "PROPOSED" &&
      t.currentUserStatus === "PENDING",
  );

  const TABS = [
    { id: "mytrips" as const, label: "My Trips" },
    {
      id: "pending" as const,
      label: "Pending",
      count: sentTrips.length + receivedTrips.length,
    },
  ];

  async function handleRespond(
    tripId: string,
    status: "CONFIRMED" | "REJECTED",
  ) {
    try {
      await respondToTripApi(tripId, status);
      await refetch();
    } catch {
      // ignore
    }
  }

  const TripCard = ({
    t,
    onClick,
    showStats = false,
  }: {
    t: Trip;
    onClick?: () => void;
    showStats?: boolean;
  }) => (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-all ${onClick ? "cursor-pointer hover:-translate-y-0.5 hover:border-violet-500/60" : ""}`}
    >
      <div className="h-1 bg-teal-400/50 border-b border-teal-400/30" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3.5">
          <div className="text-4xl leading-none">{t.cover}</div>
          <Pill color={t.status === "CONFIRMED" ? "#4ade80" : "#f59e0b"} dot>
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
            {t.members.filter((m) => m.status === "CONFIRMED").length} going
          </span>
          {showStats && t.isOwner && (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-400 dark:text-slate-600 font-syne">
                  {(t.acceptedCount ?? 0) + 1} of {t.members.length} accepted
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-[10px] text-slate-400 dark:text-slate-600 font-syne">
                  {t.declinedCount ?? 0} of {t.members.length} declined
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ReceivedTripCard = ({ t }: { t: Trip }) => (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <div className="h-1 bg-amber-400/50 border-b border-amber-400/30" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3.5">
          <div className="text-4xl leading-none">{t.cover}</div>
          <Pill color="#f59e0b" dot>
            proposed
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
        <div className="flex gap-2">
          <button
            onClick={() => handleRespond(t.id, "REJECTED")}
            className="flex-1 py-2 rounded-lg text-xs font-semibold font-syne border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-transparent hover:border-red-400 hover:text-red-400 cursor-pointer transition-all"
          >
            Decline
          </button>
          <button
            onClick={() => handleRespond(t.id, "CONFIRMED")}
            className="flex-1 py-2 rounded-lg text-xs font-semibold font-syne bg-violet-500 hover:bg-violet-400 text-white border-none cursor-pointer transition-all"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight m-0">
            Trips
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            {isGuest
              ? "Sign in to see your trips"
              : `${confirmedTrips.length} trip${confirmedTrips.length !== 1 ? "s" : ""} planned`}
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
        <div className="max-w-3x1">
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
      ) : (
        <div className="max-w-3x1">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5 w-fit">
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
                {tab.label}
                {tab.count ? (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-syne font-bold ${
                      activeTab === tab.id
                        ? "bg-violet-500/20 text-violet-500"
                        : "bg-slate-200 dark:bg-slate-600 text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {/* My Trips tab */}
          {activeTab === "mytrips" && (
            <div>
              {confirmedTrips.length === 0 ? (
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {confirmedTrips.map((t) => (
                    <TripCard
                      key={t.id}
                      t={t}
                      onClick={() => {
                        onSelectTrip(t.id);
                        navigate("/calendar");
                      }}
                    />
                  ))}
                </div>
              )}
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

          {/* Pending tab */}
          {activeTab === "pending" && (
            <div className="flex flex-col gap-5">
              {/* Sent */}
              <div>
                <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2.5">
                  SENT
                </div>
                {sentTrips.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-7 text-center flex flex-col items-center gap-2">
                    <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                      No sent proposals
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Trips you create and invite others to will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sentTrips.map((t) => (
                      <TripCard
                        key={t.id}
                        t={t}
                        showStats
                        onClick={() => {
                          onSelectTrip(t.id);
                          navigate("/calendar");
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Received */}
              <div>
                <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2.5">
                  RECEIVED
                </div>
                {receivedTrips.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-7 text-center flex flex-col items-center gap-2">
                    <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                      No received proposals
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Trip invites from friends will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {receivedTrips.map((t) => (
                      <ReceivedTripCard key={t.id} t={t} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
