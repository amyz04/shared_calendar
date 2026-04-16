import { useState, useEffect } from "react";
import type { Trip, TripDateProposal } from "../../types";
import type { Friend } from "../../types";
import {
  getProposalsApi,
  proposeDateApi,
  voteOnProposalApi,
  confirmProposalApi,
} from "../../api/proposals";
import { getUser } from "../../api/auth";
import { MONTHS } from "../../data";

interface DateProposalSectionProps {
  trip: Trip;
  members: Friend[];
  onConfirmed: (startDate: string, endDate: string) => void;
}

export function DateProposalSection({
  trip,
  members,
  onConfirmed,
}: DateProposalSectionProps) {
  const [proposals, setProposals] = useState<TripDateProposal[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = getUser();
  const confirmedProposal = proposals.find((p) => p.status === "CONFIRMED");
  const isOwner = currentUser && trip.owner?.id === currentUser.id;

  useEffect(() => {
    fetchProposals();
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

  async function handleConfirm(proposalId: string) {
    try {
      const updated = await confirmProposalApi(proposalId);
      setProposals((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
      onConfirmed(updated.startDate, updated.endDate);
    } catch (err: any) {
      setError(err.message);
    }
  }

  function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return `${MONTHS[m - 1].slice(0, 3)} ${d}, ${y}`;
  }

  const confirmedMembers = members.length;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-syne">
          Date proposals
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {confirmedProposal
            ? `Dates confirmed · ${formatDate(confirmedProposal.startDate)} → ${formatDate(confirmedProposal.endDate)}`
            : "Propose dates and vote to confirm"}
        </div>
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

        {/* Existing proposals */}
        {proposals.length > 0 && (
          <div className="mb-4 flex flex-col gap-2">
            {proposals.map((p) => {
              const userVote = p.votes.find(
                (v) => v.user.id === currentUser?.id,
              );
              const isConfirmed = p.status === "CONFIRMED";

              return (
                <div
                  key={p.id}
                  style={{
                    borderColor: isConfirmed ? "#4ade8040" : undefined,
                    background: isConfirmed ? "#4ade8008" : undefined,
                  }}
                  className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700"
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

                  {/* Vote buttons — only show if not confirmed */}
                  {!isConfirmed && (
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
                      {/* Owner can force confirm */}
                      {isOwner && (
                        <button
                          onClick={() => handleConfirm(p.id)}
                          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold font-syne border border-violet-500/50 text-violet-500 bg-violet-500/10 cursor-pointer hover:bg-violet-500/20 transition-all"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* New proposal form — hide if dates already confirmed */}
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
                  min={startDate}
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
