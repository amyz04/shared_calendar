import { useState, useMemo } from "react";
import type { Trip, Friend, BusyMap, CellData } from "../types";
import type { Theme } from "../theme";
import { Avatar, Pill } from "./ui";
import { CalendarEmptyState } from "./CalendarEmptyState";
import { FRIENDS, MONTHS, DAYS_SHORT, CURRENT_USER } from "../data";
import { daysInMonth, firstDow, fmtH, genBusy, getFreeSlots, computeWindows } from "../utils";

interface CalendarPageProps {
  trips: Trip[];
  activeTripId: number;
  onSelectTrip: (id: number) => void;
  onOpenProfile: () => void;
  calendarsSynced: boolean;
  T: Theme;
  isGuest: boolean;
}

export function CalendarPage({ trips, activeTripId, onSelectTrip, onOpenProfile, calendarsSynced, T, isGuest }: CalendarPageProps) {
  if (!calendarsSynced) return <CalendarEmptyState onOpenProfile={onOpenProfile} T={T} isGuest={isGuest} />;

  const [selDay, setSelDay] = useState<number | null>(null);
  const trip = trips.find(t => t.id === activeTripId) || trips[0];
  const members = trip.memberIds.map(id => FRIENDS.find(f => f.id === id)).filter(Boolean) as Friend[];
  const { year, month } = trip;
  const days = daysInMonth(year, month);
  const fd = firstDow(year, month);

  const allBusy = useMemo(() => {
    const out: BusyMap = {};
    members.forEach(f => { out[f.id] = genBusy(f.id * 31 + trip.id * 7, year, month); });
    return out;
  }, [trip.id]);

  const cells = useMemo(() => {
    const out: { [d: number]: CellData } = {};
    for (let d = 1; d <= days; d++) {
      const mb = members.map(f => ({ f, blocks: allBusy[f.id]?.[d] || [] }));
      const ab = mb.flatMap(x => x.blocks);
      out[d] = { memberBusy: mb, freeSlots: getFreeSlots(ab), fullyFree: members.filter(f => (allBusy[f.id]?.[d] || []).length === 0) };
    }
    return out;
  }, [trip.id]);

  const windows = useMemo(() => computeWindows(members, allBusy, year, month), [trip.id]);
  const dayStatus = (d: number) => { const r = cells[d].fullyFree.length / members.length; if (r === 1) return "free"; if (r >= 0.5) return "partial"; return "busy"; };
  const statusColor = (s: string) => s === "free" ? T.violet : s === "partial" ? T.teal : T.coral;
  const sel = selDay !== null ? cells[selDay] : null;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif", letterSpacing: "-0.02em", margin: 0 }}>Availability</h1>
        <p style={{ fontSize: 13, color: T.textMd, marginTop: 4 }}>Finding overlap for {trip.name}</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: T.violetSoft, border: `1px solid ${T.violet}50`, color: T.violet, fontFamily: "'Syne',sans-serif" }}>
          <span style={{ fontSize: 13 }}>{trip.cover}</span>{trip.name}
          <span style={{ fontSize: 11, background: `${T.violet}20`, padding: "1px 6px", borderRadius: 10 }}>{trip.memberIds.length}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 316px", gap: 20, marginBottom: 24 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "18px 22px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>{MONTHS[month]} {year}</div>
              <div style={{ fontSize: 12, color: T.textMd, marginTop: 2 }}>{members.length} members · click a day to inspect</div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[["All free", T.violet], ["Some free", T.teal], ["Conflicts", T.coral]].map(([l, c]) => (
                <div key={l as string} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.textMd }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c as string, opacity: 0.8 }} />{l}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "10px 14px 0", gap: 3 }}>
            {DAYS_SHORT.map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: T.textLo, fontFamily: "'Syne',sans-serif", letterSpacing: "0.05em", padding: "4px 0" }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "4px 14px 14px", gap: 3 }}>
            {Array.from({ length: fd }, (_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: days }, (_, i) => {
              const d = i + 1; const st = dayStatus(d); const col = statusColor(st); const isSel = selDay === d; const data = cells[d];
              return (
                <button key={d} onClick={() => setSelDay(isSel ? null : d)}
                  style={{ aspectRatio: "1", borderRadius: 8, cursor: "pointer", background: isSel ? col : st === "free" ? `${col}18` : st === "partial" ? `${col}10` : "transparent", border: `1.5px solid ${isSel ? col : `${col}${st === "busy" ? "30" : "40"}`}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}
                  onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLButtonElement).style.background = `${col}25`; }}
                  onMouseLeave={e => { if (!isSel) (e.currentTarget as HTMLButtonElement).style.background = st === "free" ? `${col}18` : st === "partial" ? `${col}10` : "transparent"; }}>
                  <span style={{ fontSize: 12, fontWeight: isSel ? 700 : st === "free" ? 600 : 400, color: isSel ? "#fff" : T.text, lineHeight: 1, fontFamily: "'Syne',sans-serif" }}>{d}</span>
                  <div style={{ display: "flex", gap: 2 }}>
                    {data.fullyFree.slice(0, 3).map(f => <div key={f.id} style={{ width: 3, height: 3, borderRadius: "50%", background: isSel ? "rgba(255,255,255,0.7)" : f.color }} />)}
                    {data.fullyFree.length > 3 && <div style={{ width: 3, height: 3, borderRadius: "50%", background: isSel ? "rgba(255,255,255,0.4)" : T.textLo }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {sel && selDay !== null ? (
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>{MONTHS[month].slice(0, 3)} {selDay}</div>
                  <div style={{ fontSize: 11, color: T.textMd, marginTop: 2 }}><span style={{ color: T.violet, fontWeight: 600 }}>{sel.fullyFree.length}</span> of {members.length} available</div>
                </div>
                {sel.freeSlots.length > 0 && <Pill color={T.violet} T={T}>{sel.freeSlots.length} window{sel.freeSlots.length > 1 ? "s" : ""}</Pill>}
              </div>
              <div style={{ padding: "14px 18px" }}>
                {sel.memberBusy.map(({ f, blocks }) => (
                  <div key={f.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Avatar f={f} size={20} T={T} />
                      <span style={{ fontSize: 12, color: blocks.length === 0 ? f.color : T.textMd, fontWeight: blocks.length === 0 ? 600 : 400, flex: 1, fontFamily: "'Syne',sans-serif" }}>{f.name.split(" ")[0]}</span>
                      {blocks.length === 0 ? <Pill color={f.color} T={T} dot>free</Pill> : <span style={{ fontSize: 10, color: T.textLo }}>{blocks.length} event{blocks.length > 1 ? "s" : ""}</span>}
                    </div>
                    <div style={{ height: 6, background: T.bgAlt, borderRadius: 99, overflow: "hidden", position: "relative" }}>
                      {blocks.length === 0
                        ? <div style={{ position: "absolute", inset: 0, background: `${f.color}30`, borderRadius: 99 }} />
                        : blocks.map((b, bi) => { const tot = 10, l = ((b.s - 8) / tot) * 100, w = ((b.e - b.s) / tot) * 100; return <div key={bi} style={{ position: "absolute", left: `${l}%`, width: `${w}%`, height: "100%", background: `${f.color}60`, borderRadius: 2 }} />; })
                      }
                    </div>
                  </div>
                ))}
                {sel.freeSlots.length > 0 && (
                  <div style={{ padding: "12px 14px", borderRadius: 10, background: T.violetSoft, border: `1px solid ${T.violet}25`, marginTop: 4 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: T.violet, letterSpacing: "0.06em", fontFamily: "'Syne',sans-serif", marginBottom: 8 }}>SHARED FREE WINDOWS</div>
                    {sel.freeSlots.map((sl, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < sel.freeSlots.length - 1 ? 6 : 0 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.violet, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: T.violet, fontWeight: 500 }}>{fmtH(sl.s)} – {fmtH(sl.e)}</span>
                        <span style={{ fontSize: 11, color: T.textMd, marginLeft: "auto" }}>{sl.e - sl.s}h</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ background: T.card, border: `1.5px dashed ${T.border}`, borderRadius: 14, padding: 28, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: T.violetSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.violet} strokeWidth={1.8} strokeLinecap="round"><rect x={3} y={4} width={18} height={18} rx={2} /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: "'Syne',sans-serif" }}>Select a day</div>
              <div style={{ fontSize: 12, color: T.textMd, lineHeight: 1.5 }}>Click any date to see who's free and shared time windows</div>
            </div>
          )}

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text, fontFamily: "'Syne',sans-serif" }}>Calendar sync</div>
            </div>
            <div style={{ padding: "6px 0" }}>
              {members.map((f, i) => {
                const total = Object.values(allBusy[f.id] || {}).reduce((s, b) => s + b.length, 0);
                const synced = i < members.length - 1;
                return (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 18px", borderBottom: i < members.length - 1 ? `1px solid ${T.border}` : "none" }}>
                    <Avatar f={f} size={24} T={T} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: T.text, fontFamily: "'Syne',sans-serif" }}>{f.name}{f.id === CURRENT_USER.id ? " (you)" : ""}</div>
                      <div style={{ fontSize: 10, color: T.textLo }}>{synced ? `${total} events` : "Invite pending"}</div>
                    </div>
                    <Pill color={synced ? T.green : T.amber} T={T}>{synced ? "synced" : "pending"}</Pill>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>Best availability windows</div>
          <div style={{ fontSize: 12, color: T.textMd, marginTop: 3 }}>Ranked by group overlap · <span style={{ fontFamily: "monospace", fontSize: 11, color: T.textLo }}>GET /api/calendar/availability/windows</span></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
          {windows.map((w, i) => {
            const col = w.score > 80 ? T.violet : w.score > 65 ? T.teal : T.amber;
            const isTop = i === 0;
            return (
              <div key={i} style={{ padding: "18px 22px", borderRight: i % 3 < 2 ? `1px solid ${T.border}` : "none", borderBottom: i < 3 ? `1px solid ${T.border}` : "none", background: isTop ? T.violetSoft : "transparent", position: "relative" }}>
                {isTop && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: T.violet }} />}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    {isTop && <div style={{ fontSize: 9, fontWeight: 700, color: T.violet, letterSpacing: "0.1em", fontFamily: "'Syne',sans-serif", marginBottom: 4 }}>BEST MATCH</div>}
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>{MONTHS[month].slice(0, 3)} {w.start}–{w.end}</div>
                    <div style={{ fontSize: 11, color: T.textMd, marginTop: 2 }}>{w.len} days · {w.count}/{w.total} free</div>
                  </div>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${col}20`, border: `2px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: col, fontFamily: "'Syne',sans-serif", flexShrink: 0 }}>{w.score}</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: w.conflicts.length > 0 ? 8 : 0 }}>
                  {w.freeNames.map((n: string) => { const f = FRIENDS.find(x => x.name.startsWith(n)); return f ? <Pill key={n} color={f.color} T={T}>{n}</Pill> : null; })}
                </div>
                {w.conflicts.length > 0 && (
                  <div style={{ fontSize: 11, color: T.coral, display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={T.coral} strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={12} r={10} /><path d="M12 8v4M12 16h.01" /></svg>
                    {w.conflicts.join(", ")} unavailable
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}