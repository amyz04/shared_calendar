import type { NavId, Trip, Friend } from "../types";
import type { Theme } from "../theme";
import { Avatar, ThemeToggle } from "./UI";
import { FRIENDS, MONTHS, NAV_ITEMS } from "../data";

interface SidebarProps {
  active: NavId;
  onNav: (id: NavId) => void;
  trips: Trip[];
  activeTripId: number;
  onSelectTrip: (id: number) => void;
  onNewTrip: () => void;
  onOpenProfile: () => void;
  T: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

export function Sidebar({ active, onNav, trips, activeTripId, onSelectTrip, onNewTrip, onOpenProfile, T, isDark, toggleTheme }: SidebarProps) {
  return (
    <aside style={{ width: 240, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0 }}>
      <div style={{ padding: "18px 18px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: T.violetSoft, border: `1px solid ${T.violet}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={T.violet} strokeWidth={2.2} strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif", letterSpacing: "-0.02em" }}>voyage</span>
        </div>
        <ThemeToggle isDark={isDark} toggle={toggleTheme} T={T} />
      </div>

      <div style={{ padding: "10px 10px 6px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: T.textLo, letterSpacing: "0.08em", fontFamily: "'Syne',sans-serif", padding: "0 8px", marginBottom: 4 }}>MENU</div>
        {NAV_ITEMS.map(n => {
          const on = active === n.id;
          return (
            <button key={n.id} onClick={() => onNav(n.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 8, marginBottom: 2, background: on ? T.violetSoft : "transparent", border: `1px solid ${on ? T.violet + "30" : "transparent"}`, color: on ? T.violet : T.textMd, fontSize: 13, fontWeight: on ? 600 : 400, cursor: "pointer", textAlign: "left", fontFamily: "'Syne',sans-serif" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={on ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
              {n.label}
            </button>
          );
        })}
      </div>

      <div style={{ height: 1, background: T.border, margin: "4px 10px" }} />

      <div style={{ flex: 1, overflowY: "auto", padding: "6px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: T.textLo, letterSpacing: "0.08em", fontFamily: "'Syne',sans-serif" }}>TRIPS</span>
          <button onClick={onNewTrip} style={{ fontSize: 16, lineHeight: 1, color: T.textMd, background: "none", border: "none", cursor: "pointer", padding: 0 }}>+</button>
        </div>
        {trips.map(t => {
          const members = t.memberIds.map(id => FRIENDS.find(f => f.id === id)).filter(Boolean) as Friend[];
          const on = activeTripId === t.id;
          return (
            <button key={t.id} onClick={() => { onSelectTrip(t.id); onNav("calendar"); }} style={{ width: "100%", padding: "8px 10px", borderRadius: 9, marginBottom: 2, background: on ? T.violetSoft : "transparent", border: `1px solid ${on ? T.violet + "30" : "transparent"}`, cursor: "pointer", textAlign: "left" }}
              onMouseEnter={e => { if (!on) (e.currentTarget as HTMLButtonElement).style.background = T.surfaceHi; }}
              onMouseLeave={e => { if (!on) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <span style={{ fontSize: 15 }}>{t.cover}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: on ? T.violet : T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Syne',sans-serif" }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: T.textLo, marginTop: 1 }}>{MONTHS[t.month].slice(0, 3)} {t.year}</div>
                </div>
              </div>
              <div style={{ display: "flex" }}>
                {members.slice(0, 5).map((f, i) => (
                  <div key={f.id} style={{ marginLeft: i === 0 ? 0 : -6, zIndex: 10 - i }}>
                    <Avatar f={f} size={18} T={T} />
                  </div>
                ))}
              </div>
            </button>
          );
        })}
        <button onClick={onNewTrip} style={{ width: "100%", padding: "7px 10px", borderRadius: 9, marginTop: 4, background: "transparent", border: `1px dashed ${T.border}`, color: T.textLo, fontSize: 12, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.violet; (e.currentTarget as HTMLButtonElement).style.color = T.violet; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.border; (e.currentTarget as HTMLButtonElement).style.color = T.textLo; }}>
          + New trip
        </button>
      </div>

      <div style={{ borderTop: `1px solid ${T.border}`, padding: "10px" }}>
        <button onClick={onOpenProfile} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9, background: "transparent", border: "1px solid transparent", cursor: "pointer", textAlign: "left" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.surfaceHi; (e.currentTarget as HTMLButtonElement).style.borderColor = T.border; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent"; }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Avatar f={FRIENDS[0]} size={30} T={T} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: T.green, border: `2px solid ${T.surface}` }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.text, fontFamily: "'Syne',sans-serif" }}>{FRIENDS[0].name}</div>
            <div style={{ fontSize: 10, color: T.textLo }}>View profile →</div>
          </div>
        </button>
      </div>
    </aside>
  );
}
