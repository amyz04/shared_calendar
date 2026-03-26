import type { Theme } from "../theme";
import { FRIENDS, MONTHS, DAYS_SHORT } from "../data";
import { Avatar, Pill } from "./UI";
import { daysInMonth, firstDow } from "../utils";

interface CalendarEmptyStateProps {
  onOpenProfile: () => void;
  T: Theme;
}

export function CalendarEmptyState({ onOpenProfile, T }: CalendarEmptyStateProps) {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const days = daysInMonth(year, month);
  const fd = firstDow(year, month);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif", letterSpacing: "-0.02em", margin: 0 }}>Availability</h1>
        <p style={{ fontSize: 13, color: T.textMd, marginTop: 4 }}>Connect a calendar to find overlap with your group</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 316px", gap: 20, marginBottom: 24 }}>

        {/* Calendar shell — empty cells */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "18px 22px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>{MONTHS[month]} {year}</div>
              <div style={{ fontSize: 12, color: T.textMd, marginTop: 2 }}>No calendar connected yet</div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[["All free", T.violet], ["Some free", T.teal], ["Conflicts", T.coral]].map(([l, c]) => (
                <div key={l as string} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.textLo, opacity: 0.35 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c as string }} />{l}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "10px 14px 0", gap: 3 }}>
            {DAYS_SHORT.map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: T.textLo, fontFamily: "'Syne',sans-serif", letterSpacing: "0.05em", padding: "4px 0" }}>{d}</div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "4px 14px 14px", gap: 3 }}>
            {Array.from({ length: fd }, (_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: days }, (_, i) => {
              const d = i + 1;
              return (
                <div key={d} style={{ aspectRatio: "1", borderRadius: 8, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 400, color: T.textLo, fontFamily: "'Syne',sans-serif" }}>{d}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: T.card, border: `1.5px dashed ${T.border}`, borderRadius: 14, padding: 28, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: T.violetSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.violet} strokeWidth={1.8} strokeLinecap="round">
                <rect x={3} y={4} width={18} height={18} rx={2} /><path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: "'Syne',sans-serif" }}>No data yet</div>
            <div style={{ fontSize: 12, color: T.textMd, lineHeight: 1.6 }}>
              Connect your calendar to see availability. Days will light up once everyone syncs.
            </div>
            <button onClick={onOpenProfile} style={{ marginTop: 4, padding: "8px 18px", borderRadius: 8, background: T.violet, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>
              Connect calendar →
            </button>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text, fontFamily: "'Syne',sans-serif" }}>Calendar sync</div>
              <Pill color={T.amber} T={T}>0 of 5 synced</Pill>
            </div>
            <div style={{ padding: "6px 0" }}>
              {FRIENDS.map((f, i) => (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 18px", borderBottom: i < FRIENDS.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <Avatar f={f} size={24} T={T} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: T.text, fontFamily: "'Syne',sans-serif" }}>{f.name}</div>
                    <div style={{ fontSize: 10, color: T.textLo }}>Invite not sent</div>
                  </div>
                  <Pill color={T.textLo} T={T}>not synced</Pill>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>Best availability windows</div>
          <div style={{ fontSize: 12, color: T.textMd, marginTop: 3 }}>Computed once all members sync their calendars</div>
        </div>
        <div style={{ padding: "40px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 500 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ flex: 1, height: 80, borderRadius: 10, background: T.bgAlt, border: `1px dashed ${T.border}`, opacity: 0.5 + i * 0.1 }} />
            ))}
          </div>
          <div style={{ fontSize: 13, color: T.textMd, lineHeight: 1.6, maxWidth: 340 }}>
            We'll automatically find the best dates once your group connects their calendars.
          </div>
          <button onClick={onOpenProfile} style={{ padding: "8px 20px", borderRadius: 8, background: "transparent", border: `1px solid ${T.violet}`, color: T.violet, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>
            Set up your calendar
          </button>
        </div>
      </div>
    </div>
  );
}
