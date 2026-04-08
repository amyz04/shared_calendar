import { useState, useEffect } from "react";
import type { Trip } from "../../types";
import { LockedButton, Pill } from "../ui";
import { InviteModal } from "./InviteModal";
import { getUser } from "../../api/auth";
import { getFriendships, updateFriendship, inviteByEmail, getSentInvites } from "../../api/friends";

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
  const [error, setError] = useState("");

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

        // skip if other is null (no account yet — handled by sentInvites)
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
      setError("Failed to load friends");
    }
  }

  async function loadSentInvites() {
    try {
      // getSentInvites returns friendships where invitee is null (no account)
      // getFriendships returns all — we need sent with accounts too
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
      setError("Failed to accept request");
    }
  }

  async function handleDecline(friendshipId: string) {
    try {
      await updateFriendship(friendshipId, "REJECTED");
      setPending(prev => prev.filter(p => p.friendshipId !== friendshipId));
    } catch {
      setError("Failed to decline request");
    }
  }

  const TABS = [
    { id: "friends" as const, label: "Friends" },
    { id: "pending" as const, label: "Pending", count: pending.length + sentInvites.length },
  ];

  const AvatarInitials = ({ name, color }: { name: string; color: string }) => (
    <div
      style={{ background: `${color}22`, border: `1.5px solid ${color}55`, color }}
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-syne shrink-0"
    >
      {name.split(" ").map(n => n[0]).join("")}
    </div>
  );

  return (
    <div>
      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onSent={handleInviteSent}
        />
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
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx={9} cy={7} r={4} />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">No friends yet</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Sign in to see your friends and invite people to your trips.</p>
            <span className="text-[11px] text-slate-400 dark:text-slate-600 font-syne">Guest mode · read only</span>
          </div>
        </div>
      ) : (
        <div className="max-w-lg">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5 w-fit">
            {TABS.map(tab => (
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
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-syne font-bold ${
                    activeTab === tab.id ? "bg-violet-500/20 text-violet-500" : "bg-slate-200 dark:bg-slate-600 text-slate-500"
                  }`}>
                    {tab.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {error && <p className="text-xs text-red-400 font-syne mb-3">{error}</p>}

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
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx={9} cy={7} r={4} />
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
                    <div className="flex flex-col gap-2">
                      {friends.map(f => (
                        <div key={f.friendshipId} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-3.5">
                          <AvatarInitials name={f.name} color={f.avatarColor} />
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">{f.name}</div>
                            <div className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">{f.email}</div>
                          </div>
                          <Pill color="#4ade80" dot>friends</Pill>
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
                      <div className="flex flex-col gap-2">
                        {pending.map(req => (
                          <div key={req.friendshipId} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-3.5">
                            <AvatarInitials name={req.fromName} color={req.avatarColor} />
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">{req.fromName}</div>
                              <div className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">{req.fromEmail}</div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => handleDecline(req.friendshipId)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold font-syne border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-transparent hover:border-red-400 hover:text-red-400 cursor-pointer transition-all"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleAccept(req.friendshipId)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold font-syne bg-violet-500 hover:bg-violet-400 text-white border-none cursor-pointer transition-all"
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
                      <div className="flex flex-col gap-2">
                        {sentInvites.map(inv => (
                          <div key={inv.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-3.5">
                            {inv.hasAccount && inv.name ? (
                              <AvatarInitials name={inv.name} color={inv.avatarColor ?? "#8b5cf6"} />
                            ) : (
                              <div
                                style={{ background: "#8b5cf622", border: "1.5px solid #8b5cf655", color: "#8b5cf6" }}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-syne shrink-0"
                              >
                                ?
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                                {inv.hasAccount && inv.name ? inv.name : inv.inviteeEmail}
                              </div>
                              <div className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">
                                {inv.hasAccount ? inv.inviteeEmail : "No account yet"}
                              </div>
                            </div>
                            <span className={`text-[11px] px-2.5 py-1 rounded-full font-syne font-semibold shrink-0 border ${
                              inv.hasAccount
                                ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                                : "bg-violet-500/10 text-violet-400 border-violet-500/30"
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