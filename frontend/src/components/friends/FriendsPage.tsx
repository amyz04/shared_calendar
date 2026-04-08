import { useState } from "react";
import type { Trip } from "../../types";
import { LockedButton } from "../ui";
import { InviteModal } from "./InviteModal";

interface FriendsPageProps {
  trips: Trip[];
  isGuest: boolean;
}

export function FriendsPage({ trips, isGuest }: FriendsPageProps) {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight m-0">
            Friends
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            {isGuest ? "Sign in to see your friends" : "0 people in your network"}
          </p>
        </div>
        {isGuest ? (
          <LockedButton>Invite a friend</LockedButton>
        ) : (
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-[13px] font-semibold font-syne border-none cursor-pointer transition-all"
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
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
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="text-slate-400">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx={9} cy={7} r={4} />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">No friends yet</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sign in to see your friends and invite people to your trips.
            </p>
            <span className="text-[11px] text-slate-400 dark:text-slate-600 font-syne">Guest mode · read only</span>
          </div>
        </div>
      ) : (
        <div className="max-w-xs">
          <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-7 py-10 text-center flex flex-col items-center gap-2.5">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="text-slate-400">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx={9} cy={7} r={4} />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">No friends yet</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Invite friends to start planning trips together.
            </p>
            <button
              onClick={() => setShowInvite(true)}
              className="mt-1 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold font-syne border-none cursor-pointer transition-all"
            >
              Invite a friend
            </button>
          </div>
        </div>
      )}
    </div>
  );
}