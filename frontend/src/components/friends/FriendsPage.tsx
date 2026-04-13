import { useState, useEffect } from "react";
import type { Trip } from "../../types";
import { LockedButton } from "../ui";
import { InviteModal } from "./InviteModal";
import { getUser } from "../../api/auth";
import {
  getFriendships,
  updateFriendship,
  inviteByEmail,
  getSentInvites,
  deleteFriendship,
} from "../../api/friends";

interface FriendEntry {
  friendshipId: string;
  name: string;
  email: string;
  avatarColor: string;
}

interface PendingRequest {
  friendshipId: string;
  fromName: string;
  fromEmail: string;
  avatarColor: string;
}

interface SentInvite {
  id: string;
  inviteeEmail: string;
  hasAccount: boolean;
  name?: string;
  avatarColor?: string;
}

interface FriendsPageProps {
  trips: Trip[];
  isGuest: boolean;
}

export function FriendsPage({ trips, isGuest }: FriendsPageProps) {
  const [showInvite, setShowInvite] = useState(false);
  const [activeTab, setActiveTab] = useState<"friends" | "pending">("friends");
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [sentInvites, setSentInvites] = useState<SentInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ friendshipId: string; name: string } | null>(null);

  const user = getUser();

  useEffect(() => {
    if (!user) return;
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setLoading(true);
      await Promise.all([loadFriendships(), loadSentInvites()]);
    } finally {
      setLoading(false);
    }
  }

  async function loadFriendships() {
    try {
      const data = await getFriendships();
      const accepted: FriendEntry[] = [];
      const received: PendingRequest[] = [];

      data.forEach((f: any) => {
        const isSender = f.sender.email === user?.email;
        const other = isSender ? f.invitee : f.sender;
        if (!other) return;
        if (f.status === "ACCEPTED") {
          accepted.push({
            friendshipId: f.id,
            name: `${other.firstName} ${other.lastName}`,
            email: other.email,
            avatarColor: other.avatarColor ?? "#8b5cf6",
          });
        } else if (f.status === "PENDING" && !isSender) {
          received.push({
            friendshipId: f.id,
            fromName: `${other.firstName} ${other.lastName}`,
            fromEmail: other.email,
            avatarColor: other.avatarColor ?? "#8b5cf6",
          });
        }
      });

      setFriends(accepted);
      setPending(received);
    } catch {
      setErrorMsg("Failed to load friends");
    }
  }

  async function loadSentInvites() {
    try {
      const [sentNoAccount, allFriendships] = await Promise.all([
        getSentInvites(),
        getFriendships(),
      ]);

      const sentWithAccount: SentInvite[] = allFriendships
        .filter((f: any) => f.sender.email === user?.email && f.invitee && f.status === "PENDING")
        .map((f: any) => ({
          id: f.id,
          inviteeEmail: f.inviteeEmail,
          hasAccount: true,
          name: `${f.invitee.firstName} ${f.invitee.lastName}`,
          avatarColor: f.invitee.avatarColor ?? "#8b5cf6",
        }));

      const sentNoAccountMapped: SentInvite[] = sentNoAccount.map((f: any) => ({
        id: f.id,
        inviteeEmail: f.inviteeEmail,
        hasAccount: false,
      }));

      setSentInvites([...sentWithAccount, ...sentNoAccountMapped]);
    } catch {
      // ignore
    }
  }

  async function handleInviteSent(toEmail: string) {
    try {
      await inviteByEmail(toEmail);
      await loadAll();
    } catch {
      // ignore
    }
  }

  async function handleAccept(friendshipId: string) {
    try {
      await updateFriendship(friendshipId, "ACCEPTED");
      await loadAll();
    } catch {
      setErrorMsg("Failed to accept request");
    }
  }

  async function handleDecline(friendshipId: string) {
    try {
      await updateFriendship(friendshipId, "REJECTED");
      setPending((prev) => prev.filter((p) => p.friendshipId !== friendshipId));
    } catch {
      setErrorMsg("Failed to decline request");
    }
  }

  function handleDeleteFriend(friendshipId: string, name: string) {
    setConfirmDelete({ friendshipId, name });
  }

  async function confirmDeleteFriend() {
    if (!confirmDelete) return;
    try {
      await deleteFriendship(confirmDelete.friendshipId);
      await loadAll();
      if (friends.length <= 1) setDeleteMode(false);
    } catch {
      setErrorMsg("Failed to remove friend");
    } finally {
      setConfirmDelete(null);
    }
  }

  const TABS = [
    { id: "friends" as const, label: "Friends" },
    { id: "pending" as const, label: "Pending", count: pending.length + sentInvites.length },
  ];

  return (
    <div>
      {/* Error Modal */}
      {errorMsg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7 w-[360px] flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center">
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth={2} strokeLinecap="round">
                <circle cx={12} cy={12} r={10} />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne mb-1">Something went wrong</div>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">{errorMsg}</p>
            </div>
            <button
              onClick={() => setErrorMsg("")}
              className="w-full py-2.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-[13px] font-semibold font-syne border-none cursor-pointer transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7 w-[360px] flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center">
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth={2} strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx={9} cy={7} r={4} />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne mb-1">Remove friend</div>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">{confirmDelete.name}</span>{" "}
                from your friends?
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-[13px] font-semibold font-syne bg-transparent hover:border-slate-300 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFriend}
                className="flex-1 py-2.5 rounded-lg bg-red-400 hover:bg-red-500 text-white text-[13px] font-semibold font-syne border-none cursor-pointer transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {showInvite && (
        <InviteModal onClose={() => setShowInvite(false)} onSent={handleInviteSent} />
      )}

      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight m-0">Friends</h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            {isGuest ? "Sign in to see your friends" : `${friends.length} person${friends.length !== 1 ? "s" : ""} in your network`}
          </p>
        </div>
        {isGuest ? (
          <LockedButton>Invite a friend</LockedButton>
        ) : (
          <div className="flex items-center gap-2">
            {activeTab === "friends" && friends.length > 0 && (
              <button
                onClick={() => setDeleteMode(d => !d)}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-[13px] font-semibold font-syne border cursor-pointer transition-all ${
                  deleteMode
                    ? "bg-red-400/10 border-red-400/30 text-red-400 hover:bg-red-400/20"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                </svg>
                {deleteMode ? "Done" : "Remove"}
              </button>
            )}
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-[13px] font-semibold font-syne border-none cursor-pointer transition-all"
            >
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Invite a friend
            </button>
          </div>
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
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Sign in to see your friends and invite people to your trips.</p>
            <span className="text-[11px] text-slate-400 dark:text-slate-600 font-syne">Guest mode · read only</span>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setDeleteMode(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold font-syne border-none cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-700 text-violet-500 shadow-sm"
                    : "bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
                {tab.count ? (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-syne font-bold ${
                    activeTab === tab.id ? "bg-violet-500/20 text-violet-500" : "bg-slate-200 dark:bg-slate-600 text-slate-500"
                  }`}>
                    {tab.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
            </div>
          ) : (
            <>
              {/* Friends tab */}
              {activeTab === "friends" && (
                <div>
                  {friends.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-7 py-10 text-center flex flex-col items-center gap-2.5">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="text-slate-400">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx={9} cy={7} r={4} />
                          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                        </svg>
                      </div>
                      <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">No friends yet</div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Invite friends to start planning trips together.</p>
                      <button
                        onClick={() => setShowInvite(true)}
                        className="mt-1 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold font-syne border-none cursor-pointer transition-all"
                      >
                        Invite a friend
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {friends.map((f) => (
                        <div
                          key={f.friendshipId}
                          className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-center gap-3 text-center"
                        >
                          {deleteMode && (
                            <button
                              onClick={() => handleDeleteFriend(f.friendshipId, f.name)}
                              className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-red-400 flex items-center justify-center cursor-pointer border-none hover:bg-red-500 transition-all"
                            >
                              <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                          <div
                            style={{ background: `${f.avatarColor}22`, border: `2px solid ${f.avatarColor}55`, color: f.avatarColor }}
                            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold font-syne"
                          >
                            {f.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="min-w-0 w-full">
                            <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne truncate">{f.name}</div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-600 mt-0.5 truncate">{f.email}</div>
                          </div>
                          <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-syne font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            friends
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pending tab */}
              {activeTab === "pending" && (
                <div className="flex flex-col gap-5">
                  {/* Received */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2.5">RECEIVED</div>
                    {pending.length === 0 ? (
                      <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-7 text-center flex flex-col items-center gap-2">
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">No incoming requests</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Friend requests will appear here when someone invites you.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        {pending.map((req) => (
                          <div key={req.friendshipId} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
                            <div
                              style={{ background: `${req.avatarColor}22`, border: `2px solid ${req.avatarColor}55`, color: req.avatarColor }}
                              className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold font-syne"
                            >
                              {req.fromName.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="min-w-0 w-full">
                              <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne truncate">{req.fromName}</div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-600 mt-0.5 truncate">{req.fromEmail}</div>
                            </div>
                            <div className="flex gap-2 w-full">
                              <button
                                onClick={() => handleDecline(req.friendshipId)}
                                className="flex-1 py-1.5 rounded-lg text-xs font-semibold font-syne border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-transparent hover:border-red-400 hover:text-red-400 cursor-pointer transition-all"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleAccept(req.friendshipId)}
                                className="flex-1 py-1.5 rounded-lg text-xs font-semibold font-syne bg-violet-500 hover:bg-violet-400 text-white border-none cursor-pointer transition-all"
                              >
                                Accept
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sent */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2.5">SENT</div>
                    {sentInvites.length === 0 ? (
                      <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-7 text-center flex flex-col items-center gap-2">
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">No sent requests</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Invites you send will appear here until accepted.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        {sentInvites.map((inv) => (
                          <div key={inv.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
                            {inv.hasAccount && inv.name ? (
                              <div
                                style={{ background: `${inv.avatarColor ?? "#8b5cf6"}22`, border: `2px solid ${inv.avatarColor ?? "#8b5cf6"}55`, color: inv.avatarColor ?? "#8b5cf6" }}
                                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold font-syne"
                              >
                                {inv.name.split(" ").map((n) => n[0]).join("")}
                              </div>
                            ) : (
                              <div
                                style={{ background: "#8b5cf622", border: "2px solid #8b5cf655", color: "#8b5cf6" }}
                                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold font-syne"
                              >
                                ?
                              </div>
                            )}
                            <div className="min-w-0 w-full">
                              <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne truncate">
                                {inv.hasAccount && inv.name ? inv.name : inv.inviteeEmail}
                              </div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-600 mt-0.5 truncate">
                                {inv.hasAccount ? inv.inviteeEmail : "No account yet"}
                              </div>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-full font-syne font-semibold border ${
                              inv.hasAccount ? "bg-amber-400/10 text-amber-400 border-amber-400/30" : "bg-violet-500/10 text-violet-400 border-violet-500/30"
                            }`}>
                              {inv.hasAccount ? "Pending" : "Invited"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}