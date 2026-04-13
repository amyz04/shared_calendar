import type { Friend } from "../../types";
import { Avatar, Pill } from "../ui";
import { getUser } from "../../api/auth";
import { useCalendars } from "../../context/CalendarContext";

interface CalendarSyncCardProps {
  members: Friend[];
  busyEventCounts?: Record<number, number>;
  isGuest?: boolean;
}

export function CalendarSyncCard({
  members,
  busyEventCounts,
  isGuest,
}: CalendarSyncCardProps) {
  const currentUser = getUser();
  const { calendars } = useCalendars();

  // user is synced if they have at least one imported calendar
  const currentUserSynced = calendars.length > 0;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-syne">
          Calendar sync
        </span>
        {isGuest && <Pill color="#f59e0b">not signed in</Pill>}
      </div>
      <div className="py-1.5">
        {isGuest ? (
          <div className="flex items-center gap-2.5 px-4 py-3">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
              <svg
                width={12}
                height={12}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="text-slate-400"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx={12} cy={7} r={4} />
              </svg>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-600 font-syne">
              Sign in to see your sync status
            </span>
          </div>
        ) : (
          members.map((f, i) => {
            const isYou = currentUser && f.email === currentUser.email;
            const synced = isYou ? currentUserSynced : f.hasSynced;
            const total = busyEventCounts?.[f.id] ?? 0;

            return (
              <div
                key={f.id}
                className={`flex items-center gap-2.5 px-4 py-2 ${i < members.length - 1 ? "border-b border-slate-200 dark:border-slate-700" : ""}`}
              >
                <Avatar f={f} size={24} />
                <div className="flex-1">
                  <div className="text-xs font-medium text-slate-900 dark:text-slate-100 font-syne">
                    {f.name}
                    {isYou ? " (you)" : ""}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-600">
                    {synced
                      ? `${total} event${total !== 1 ? "s" : ""}`
                      : "Invite pending"}
                  </div>
                </div>
                <Pill color={synced ? "#4ade80" : "#f59e0b"}>
                  {synced ? "synced" : "pending"}
                </Pill>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
