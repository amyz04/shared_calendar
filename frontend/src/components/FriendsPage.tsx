import { useState } from "react";
import type { Trip } from "../types";
import type { Theme } from "../theme";
import { Avatar, Pill, LockedBtn } from "./ui";
import { FRIENDS } from "../data";

interface FriendsPageProps {
  trips: Trip[];
  T: Theme;
  isGuest: boolean;
}

function InviteModal({ T, onClose }: { T: Theme; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const ok = name.trim() !== "" && email.trim().includes("@");

  const is = {
    width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13,
    background: T.bgAlt, border: `1px solid ${T.border}`, color: T.text,
    outline: "none", fontFamily: "'Syne',sans-serif",
  } as const;

  function handleSend() {
    if (!ok) return;
    setSent(true);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28, width: 400 }}>

        {sent ? (
          /* Success state */
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${T.green}18`, border: `1px solid ${T.green}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth={2} strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>Invite sent!</div>
            <div style={{ fontSize: 13, color: T.textMd, lineHeight: 1.6, marginBottom: 22 }}>
              We sent an invite to <strong style={{ color: T.text }}>{email}</strong>. They'll get an email to join voyage and sync their calendar.
            </div>
            <button onClick={onClose} style={{ width: "100%", padding: "10px", borderRadius: 9, background: T.violet, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif", margin: 0 }}>Invite a friend</h2>
                <p style={{ fontSize: 12, color: T.textMd, marginTop: 4 }}>They'll get an email to join voyage</p>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", color: T.textMd, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: T.textMd, marginBottom: 5, fontFamily: "'Syne',sans-serif" }}>Their name</div>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Jordan"
                  style={is}
                />
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.textMd, marginBottom: 5, fontFamily: "'Syne',sans-serif" }}>Their email</div>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="friend@email.com"
                  type="email"
                  style={is}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 9, background: "transparent", border: `1px solid ${T.border}`, color: T.textMd, fontSize: 13, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>
                Cancel
              </button>
              <button onClick={handleSend} disabled={!ok}
                style={{ flex: 2, padding: "10px", borderRadius: 9, background: ok ? T.violet : T.border, border: "none", color: ok ? "#fff" : T.textLo, fontSize: 13, fontWeight: 600, cursor: ok ? "pointer" : "default", fontFamily: "'Syne',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
                Send invite
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function FriendsPage({ trips, T, isGuest }: FriendsPageProps) {
  const [showInvite, setShowInvite] = useState(false);
  const f = FRIENDS[0];
  const shared = trips.filter(t => t.memberIds.includes(f.id));

  return (
    <div>
      {showInvite && <InviteModal T={T} onClose={() => setShowInvite(false)} />}

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif", letterSpacing: "-0.02em", margin: 0 }}>Friends</h1>
          <p style={{ fontSize: 13, color: T.textMd, marginTop: 4 }}>
            {isGuest ? "Sign in to see your friends" : "1 person in your network"}
          </p>
        </div>
        {isGuest
          ? <LockedBtn T={T}>Invite a friend</LockedBtn>
          : <button onClick={() => setShowInvite(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 9, background: T.violet, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              Invite a friend
            </button>
        }
      </div>

      {isGuest ? (
        /* Empty state for guests */
        <div style={{ maxWidth: 340 }}>
          <div style={{ background: T.card, border: `1.5px dashed ${T.border}`, borderRadius: 14, padding: "40px 28px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: T.surfaceHi, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.textLo} strokeWidth={1.8} strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx={9} cy={7} r={4} />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: "'Syne',sans-serif" }}>No friends yet</div>
            <div style={{ fontSize: 12, color: T.textMd, lineHeight: 1.6 }}>
              Sign in to see your friends and invite people to your trips.
            </div>
            <div style={{ fontSize: 11, color: T.textLo, fontFamily: "'Syne',sans-serif" }}>
              Guest mode · read only
            </div>
          </div>
        </div>
      ) : (
        /* Logged in friend list */
        <div style={{ maxWidth: 340 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <Avatar f={f} size={48} T={T} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>{f.name}</div>
                <div style={{ fontSize: 12, color: T.textLo, marginTop: 2 }}>{f.email}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <Pill color={T.green} T={T} dot>cal synced</Pill>
              <span style={{ fontSize: 11, color: T.textLo }}>{shared.length} trip{shared.length !== 1 ? "s" : ""} together</span>
            </div>
            {shared.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {shared.map(t => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 8, background: T.surfaceHi, border: `1px solid ${T.border}`, fontSize: 12, color: T.textMd, fontFamily: "'Syne',sans-serif" }}>
                    <span style={{ fontSize: 13 }}>{t.cover}</span>{t.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowInvite(true)}
            style={{ width: "100%", marginTop: 12, padding: "14px", borderRadius: 14, background: "transparent", border: `1.5px dashed ${T.border}`, color: T.textLo, fontSize: 13, cursor: "pointer", fontFamily: "'Syne',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = T.violet; b.style.color = T.violet; b.style.background = T.violetSoft; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = T.border; b.style.color = T.textLo; b.style.background = "transparent"; }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Invite a friend
          </button>
        </div>
      )}
    </div>
  );
}