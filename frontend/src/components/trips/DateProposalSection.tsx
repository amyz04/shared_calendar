import { useState } from "react";
import type { Trip, Friend } from "../../types";
import { getUser } from "../../api/auth";
import type { DateProposal, ConfirmedRange } from "./tripUtils";
import { getDatesInRange, fmtDate } from "./tripUtils";

interface DateProposalSectionProps {
  trip: Trip;
  members: Friend[];
  onConfirm: (range: ConfirmedRange) => void;
}

export function DateProposalSection({
  trip,
  members,
  onConfirm,
}: DateProposalSectionProps) {
  const [proposals, setProposals] = useState<DateProposal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const user = getUser();
  const currentUserName = user ? `${user.firstName} ${user.lastName}` : "You";
  const currentUserColor = user?.avatarColor ?? "#8b5cf6";
  const currentUserInitials = user
    ? `${user.firstName?.[0]}${user.lastName?.[0]}`
    : "U";

  const is =
    "w-full px-3 py-2 rounded-lg text-[13px] bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 outline-none font-syne";

  function propose() {
    if (!startDate || !endDate) return;
    const p: DateProposal = {
      id: crypto.randomUUID(),
      proposedBy: currentUserName,
      startDate,
      endDate,
      votes: [{ userId: currentUserName, vote: "agree" }],
    };
    setProposals((prev) => [...prev, p]);
    setShowForm(false);
    setStartDate("");
    setEndDate("");
  }

  function vote(proposalId: string, v: "agree" | "disagree") {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id !== proposalId) return p;
        const filtered = p.votes.filter((x) => x.userId !== currentUserName);
        return {
          ...p,
          votes: [...filtered, { userId: currentUserName, vote: v }],
        };
      }),
    );
  }

  const myVote = (p: DateProposal) =>
    p.votes.find((v) => v.userId === currentUserName)?.vote;
  const agreeCount = (p: DateProposal) =>
    p.votes.filter((v) => v.vote === "agree").length;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden mb-5">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-syne">
            Date proposals
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Any member can propose — everyone votes
          </div>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
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
          Propose dates
        </button>
      </div>

      {showForm && (
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne font-medium">
                Start date
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={is}
              />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne font-medium">
                End date
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={is}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 rounded-lg bg-transparent border border-slate-200 dark:border-slate-600 text-slate-500 text-xs font-syne cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={propose}
              disabled={!startDate || !endDate}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold font-syne border-none transition-all ${startDate && endDate ? "bg-violet-500 hover:bg-violet-600 text-white cursor-pointer" : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-default"}`}
            >
              Submit proposal
            </button>
          </div>
        </div>
      )}

      {proposals.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <div className="text-[13px] text-slate-500 dark:text-slate-400 font-syne">
            No proposals yet — be the first to suggest dates!
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {proposals.map((p) => {
            const agreed = agreeCount(p);
            const total = members.length;
            const pct = Math.round((agreed / total) * 100);
            const mv = myVote(p);
            const allAgreed = agreed === total;
            return (
              <div key={p.id} className="px-5 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                      {fmtDate(p.startDate)} → {fmtDate(p.endDate)}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {getDatesInRange(p.startDate, p.endDate).length} days ·
                      proposed by {p.proposedBy}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-syne">
                      {agreed}/{total}
                    </div>
                    <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded-full transition-all ${allAgreed ? "bg-emerald-500" : pct >= 50 ? "bg-violet-500" : "bg-slate-400"}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Avatar votes — now using initials instead of Avatar component */}
                  <div className="flex -space-x-1.5 flex-1">
                    {p.votes.map((v) => (
                      <div key={v.userId} className="relative">
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: `${currentUserColor}22`,
                            border: `1.5px solid ${currentUserColor}55`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 8,
                            fontWeight: 700,
                            color: currentUserColor,
                          }}
                        >
                          {currentUserInitials}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white dark:border-slate-800 flex items-center justify-center ${v.vote === "agree" ? "bg-emerald-500" : "bg-red-400"}`}
                        >
                          {v.vote === "agree" ? (
                            <svg
                              width={6}
                              height={6}
                              viewBox="0 0 10 10"
                              fill="none"
                              stroke="#fff"
                              strokeWidth={2}
                            >
                              <path d="M2 5l2 2 4-4" />
                            </svg>
                          ) : (
                            <svg
                              width={6}
                              height={6}
                              viewBox="0 0 10 10"
                              fill="none"
                              stroke="#fff"
                              strokeWidth={2}
                            >
                              <path d="M3 3l4 4M7 3l-4 4" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {p.proposedBy !== currentUserName && !allAgreed && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => vote(p.id, "agree")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold font-syne border transition-all ${mv === "agree" ? "bg-emerald-500 text-white border-emerald-500" : "bg-transparent text-emerald-600 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-500/10"}`}
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
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Agree
                      </button>
                      <button
                        onClick={() => vote(p.id, "disagree")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold font-syne border transition-all ${mv === "disagree" ? "bg-red-400 text-white border-red-400" : "bg-transparent text-red-400 border-red-200 dark:border-red-800 hover:bg-red-400/10"}`}
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
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                        Disagree
                      </button>
                    </div>
                  )}

                  {allAgreed && (
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold font-syne border border-emerald-200 dark:border-emerald-800">
                        ✓ All agreed!
                      </span>
                      <button
                        onClick={() =>
                          onConfirm({ start: p.startDate, end: p.endDate })
                        }
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold font-syne border-none cursor-pointer transition-all"
                      >
                        Confirm dates →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
