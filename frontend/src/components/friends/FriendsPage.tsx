import { useState } from "react";
import type { Trip } from "../../types";
import { Avatar, Pill, LockedButton } from "../ui";
import { InviteModal } from "./InviteModal";
import { FRIENDS } from "../../data";

interface FriendsPageProps {
  trips: Trip[];
  isGuest: boolean;
}

export function FriendsPage({ trips, isGuest }: FriendsPageProps) {
  const [showInvite, setShowInvite] = useState(false);
  const f = FRIENDS[0];
  const shared = trips.filter((t) => t.memberIds.includes(f.id));

  return (
    <div>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight m-0">
            Friends
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            {isGuest
              ? "Sign in to see your friends"
              : "1 person in your network"}
          </p>
        </div>
        {isGuest ? (
          <LockedButton>Invite a friend</LockedButton>
        ) : (
          <button
            onClick={() => setShowInvite(true)}
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
            Invite a friend
          </button>
        )}
      </div>

      {isGuest ? (
        <div className="max-w-xs">
          <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-7 py-10 text-center flex flex-col items-center gap-2.5">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                className="text-slate-400"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx={9} cy={7} r={4} />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
              No friends yet
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sign in to see your friends and invite people to your trips.
            </p>
            <span className="text-[11px] text-slate-400 dark:text-slate-600 font-syne">
              Guest mode · read only
            </span>
          </div>
        </div>
      ) : (
        <div className="max-w-xs">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <div className="flex items-center gap-3.5 mb-4">
              <Avatar f={f} size={48} />
              <div>
                <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne">
                  {f.name}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">
                  {f.email}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3.5">
              <Pill color="#4ade80" dot>
                cal synced
              </Pill>
              <span className="text-[11px] text-slate-400 dark:text-slate-600">
                {shared.length} trip{shared.length !== 1 ? "s" : ""} together
              </span>
            </div>
            {shared.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {shared.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-500 dark:text-slate-400 font-syne"
                  >
                    <span className="text-[13px]">{t.cover}</span>
                    {t.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowInvite(true)}
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
            Invite a friend
          </button>
        </div>
      )}
    </div>
  );
}
