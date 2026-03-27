import type { Trip, Friend, NavId } from "../types";
import type { Theme } from "../theme";
import { Avatar, Pill } from "./UI";
import { FRIENDS, MONTHS } from "../data";

interface TripsPageProps {
  trips: Trip[];
  onSelectTrip: (id: number) => void;
  onNewTrip: () => void;
  onNav: (id: NavId) => void;
  T: Theme;
  isGuest: boolean;
}

export function TripsPage({ trips, onSelectTrip, onNewTrip, onNav, T, isGuest }: TripsPageProps) {
  const t = trips[0];
  const members = t.memberIds.map(id => FRIENDS.find(f => f.id === id)).filter(Boolean) as Friend[];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif", letterSpacing: "-0.02em", margin: 0 }}>My Trips</h1>
          <p style={{ fontSize: 13, color: T.textMd, marginTop: 4 }}>
            {isGuest ? "Sign in to see your trips" : "1 trip planned"}
          </p>
        </div>
        {!isGuest && (
          <button onClick={onNewTrip} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 9, background: T.violet, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            New trip
          </button>
        )}
      </div>

      {isGuest ? (
        <div style={{ maxWidth: 380 }}>
          <div style={{ background: T.card, border: `1.5px dashed ${T.border}`, borderRadius: 14, padding: "48px 28px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: T.surfaceHi, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={T.textLo} strokeWidth={1.8} strokeLinecap="round">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: "'Syne',sans-serif" }}>No trips yet</div>
            <div style={{ fontSize: 12, color: T.textMd, lineHeight: 1.6 }}>
              Sign in to create trips and find the best dates for your group.
            </div>
            <div style={{ fontSize: 11, color: T.textLo, fontFamily: "'Syne',sans-serif" }}>
              Guest mode · read only
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 380 }}>
          <div onClick={() => { onSelectTrip(t.id); onNav("calendar"); }}
            style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = `${T.violet}60`; el.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = T.border; el.style.transform = "none"; }}>
            <div style={{ height: 4, background: `${T.teal}50`, borderBottom: `1px solid ${T.teal}30` }} />
            <div style={{ padding: "20px 20px 18px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 36, lineHeight: 1 }}>{t.cover}</div>
                <Pill color={T.teal} T={T} dot>{t.status}</Pill>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif", letterSpacing: "-0.01em", marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: T.textMd, display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx={12} cy={10} r={3} /></svg>
                  {t.dest} · {MONTHS[t.month]} {t.year}
                </div>
              </div>
              <div style={{ height: 1, background: T.border, marginBottom: 14 }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                  {members.map((f, i) => (
                    <div key={f.id} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 10 - i }}>
                      <Avatar f={f} size={28} T={T} />
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 11, color: T.textLo }}>{members.length} going</span>
              </div>
            </div>
          </div>

          <button onClick={onNewTrip}
            style={{ width: "100%", marginTop: 12, padding: "14px", borderRadius: 14, background: "transparent", border: `1.5px dashed ${T.border}`, color: T.textLo, fontSize: 13, cursor: "pointer", fontFamily: "'Syne',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = T.violet; b.style.color = T.violet; b.style.background = T.violetSoft; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = T.border; b.style.color = T.textLo; b.style.background = "transparent"; }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Plan another trip
          </button>
        </div>
      )}
    </div>
  );
}