import { useState, useEffect } from "react";
import type { Trip, TripDateProposal } from "../../types";
import type { Friend } from "../../types";
import {
  getProposalsApi,
  proposeDateApi,
  voteOnProposalApi,
  resetProposalsApi,
} from "../../api/proposals";
import { getUser } from "../../api/auth";
import { MONTHS } from "../../data";

interface DateProposalSectionProps {
  trip: Trip;
  members: Friend[];
  onConfirmed: (startDate: string, endDate: string) => void;
  onReset: () => void;
}

export function DateProposalSection({
  trip,
  members,
  onConfirmed,
  onReset,
}: DateProposalSectionProps) {
  const [proposals, setProposals] = useState<TripDateProposal[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = getUser();
  const confirmedProposal = proposals.find((p) => p.status === "CONFIRMED");

  useEffect(() => {
    fetchProposals();
    const interval = setInterval(fetchProposals, 2000);
    return () => clearInterval(interval);
  }, [trip.id]);

  async function fetchProposals() {
    try {
      const data = await getProposalsApi(trip.id);
      setProposals(data);
      const confirmed = data.find((p) => p.status === "CONFIRMED");
      if (confirmed) onConfirmed(confirmed.startDate, confirmed.endDate);
    } catch (err: any) {
      console.error("Failed to fetch proposals:", err.message);
    }
  }

  async function handlePropose() {
    if (!startDate || !endDate) return;

    // check for duplicate
    const isDuplicate = proposals.some(
      (p) => p.startDate === startDate && p.endDate === endDate,
    );
    if (isDuplicate) {
      setError("These dates have already been proposed. Please choose different dates.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const proposal = await proposeDateApi(trip.id, startDate, endDate);
      setProposals((prev) => [...prev, proposal]);
      setStartDate("");
      setEndDate("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(proposalId: string, vote: "AGREE" | "DISAGREE") {
    try {
      const updated = await voteOnProposalApi(proposalId, vote);
      setProposals((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
      if (updated.status === "CONFIRMED") {
        onConfirmed(updated.startDate, updated.endDate);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleReset() {
    try {
      setResetting(true);
      await resetProposalsApi(trip.id);
      setProposals([]);
      setShowResetConfirm(false);
      onReset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResetting(false);
    }
  }

  function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return `${MONTHS[m - 1].slice(0, 3)} ${d}, ${y}`;
  }

  const confirmedMembers = members.length;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">

      {/* Reset confirm modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7 w-[360px] flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center">
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round">
                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne mb-1">
                Repropose dates?
              </div>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                This will clear all current proposals and delete all events added to the trip itinerary. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 text-[13px] font-semibold font-syne bg-transparent cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-semibold font-syne border-none cursor-pointer transition-all disabled:opacity-60"
              >
                {resetting ? "Resetting..." : "Yes, repropose"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-syne">
            Date proposals
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {confirmedProposal
              ? `Dates confirmed · ${formatDate(confirmedProposal.startDate)} → ${formatDate(confirmedProposal.endDate)}`
              : "Propose dates and vote to confirm"}
          </div>
        </div>
        {confirmedProposal ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold font-syne cursor-pointer hover:bg-amber-500/20 transition-all"
          >
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" />
            </svg>
            Repropose
          </button>
        ) : null}
      </div>

      <div className="p-5">
        {/* Confirmed banner */}
        {confirmedProposal && (
          <div className="px-4 py-3 rounded-xl bg-green-400/10 border border-green-400/30 mb-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            <div>
              <div className="text-[13px] font-semibold text-green-500 font-syne">
                Trip confirmed
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {formatDate(confirmedProposal.startDate)} →{" "}
                {formatDate(confirmedProposal.endDate)}
              </div>
            </div>
          </div>
        )}

        {/* Proposals list */}
        {proposals.length > 0 && (
          <div className="mb-4 flex flex-col gap-2">
            {proposals.map((p) => {
              const userVote = p.votes.find(
                (v) => v.user.id === currentUser?.id,
              );
              const isConfirmed = p.status === "CONFIRMED";
              const isLocked = !!confirmedProposal && !isConfirmed;

              return (
                <div
                  key={p.id}
                  style={{
                    borderColor: isConfirmed ? "#4ade8040" : undefined,
                    background: isConfirmed ? "#4ade8008" : undefined,
                    opacity: isLocked ? 0.4 : 1,
                  }}
                  className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-opacity"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                        {formatDate(p.startDate)} → {formatDate(p.endDate)}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-600">
                        Proposed by {p.proposedBy.firstName} · {p.agreeCount}/
                        {confirmedMembers} agree
                      </div>
                    </div>
                    {isConfirmed && (
                      <span className="text-[11px] font-semibold text-green-500 font-syne px-2 py-1 rounded-full bg-green-400/10 border border-green-400/30">
                        confirmed
                      </span>
                    )}
                  </div>

                  {/* Vote buttons — hidden if confirmed or locked */}
                  {!isConfirmed && !isLocked && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(p.id, "AGREE")}
                        className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold font-syne border cursor-pointer transition-all ${
                          userVote?.vote === "AGREE"
                            ? "bg-green-400/20 border-green-400/50 text-green-500"
                            : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 hover:border-green-400/50 hover:text-green-500"
                        }`}
                      >
                        Agree {userVote?.vote === "AGREE" ? "✓" : ""}
                      </button>
                      <button
                        onClick={() => handleVote(p.id, "DISAGREE")}
                        className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold font-syne border cursor-pointer transition-all ${
                          userVote?.vote === "DISAGREE"
                            ? "bg-red-400/20 border-red-400/50 text-red-400"
                            : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 hover:border-red-400/50 hover:text-red-400"
                        }`}
                      >
                        Disagree
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Proposal form — hidden once confirmed */}
        {!confirmedProposal && (
          <div>
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2">
              PROPOSE DATES
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-syne">
                  Start
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={`${trip.year}-${String(trip.month + 1).padStart(2, "0")}-01`}
                  max={`${trip.year}-${String(trip.month + 1).padStart(2, "0")}-${new Date(trip.year, trip.month + 1, 0).getDate()}`}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[13px] text-slate-900 dark:text-slate-100 font-syne"
                />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-syne">
                  End
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || `${trip.year}-${String(trip.month + 1).padStart(2, "0")}-01`}
                  max={`${trip.year}-${String(trip.month + 1).padStart(2, "0")}-${new Date(trip.year, trip.month + 1, 0).getDate()}`}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[13px] text-slate-900 dark:text-slate-100 font-syne"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 mb-2 font-syne">{error}</p>
            )}

            <button
              onClick={handlePropose}
              disabled={!startDate || !endDate || loading}
              className={`w-full py-2.5 rounded-lg text-[13px] font-semibold font-syne border-none transition-all ${
                startDate && endDate && !loading
                  ? "bg-violet-500 hover:bg-violet-600 text-white cursor-pointer"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-default"
              }`}
            >
              {loading ? "Proposing..." : "Propose dates"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}