import { useState } from "react";
import type { Trip } from "../types";
import type { Theme } from "../theme";
import { Avatar } from "./UI";
import { FRIENDS, MONTHS, EMOJIS } from "../data";

interface NewTripModalProps {
  onClose: () => void;
  onCreate: (d: Omit<Trip, "id" | "status">) => void;
  T: Theme;
}

export function NewTripModal({ onClose, onCreate, T }: NewTripModalProps) {
  const [name, setName] = useState("");
  const [dest, setDest] = useState("");
  const [cover, setCover] = useState("✈️");
  const [month, setMonth] = useState(5);
  const [year, setYear] = useState(2025);
  const [sel, setSel] = useState<number[]>([1]);

  const toggle = (id: number) => {
    if (id === 1) return;
    setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const ok = name.trim() !== "" && dest.trim() !== "";
  const is = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: T.bgAlt, border: `1px solid ${T.border}`, color: T.text, outline: "none", fontFamily: "'Syne',sans-serif" } as const;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28, width: 500, maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif", margin: 0 }}>Plan a new trip</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textMd, fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: T.textMd, fontFamily: "'Syne',sans-serif", marginBottom: 8, fontWeight: 500 }}>Trip icon</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setCover(e)} style={{ width: 36, height: 36, borderRadius: 8, fontSize: 17, cursor: "pointer", background: cover === e ? T.violetSoft : T.bgAlt, border: `1px solid ${cover === e ? T.violet : T.border}` }}>{e}</button>
            ))}
          </div>
        </div>

        {([["Trip name", name, setName, "e.g. Portugal Summer"], ["Destination", dest, setDest, "e.g. Lisbon"]] as const).map(([l, v, s, p]) => (
          <div key={l} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: T.textMd, marginBottom: 6, fontWeight: 500, fontFamily: "'Syne',sans-serif" }}>{l}</div>
            <input value={v as string} onChange={e => (s as (v: string) => void)(e.target.value)} placeholder={p as string} style={is} />
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, color: T.textMd, marginBottom: 6, fontWeight: 500, fontFamily: "'Syne',sans-serif" }}>Month</div>
            <select value={month} onChange={e => setMonth(+e.target.value)} style={is}>
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.textMd, marginBottom: 6, fontWeight: 500, fontFamily: "'Syne',sans-serif" }}>Year</div>
            <select value={year} onChange={e => setYear(+e.target.value)} style={is}>
              {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, color: T.textMd, marginBottom: 8, fontWeight: 500, fontFamily: "'Syne',sans-serif" }}>Invite friends</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, maxHeight: 200, overflowY: "auto" }}>
            {FRIENDS.map(f => {
              const on = sel.includes(f.id);
              return (
                <button key={f.id} onClick={() => toggle(f.id)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, cursor: f.id === 1 ? "default" : "pointer", background: on ? `${f.color}10` : T.bgAlt, border: `1px solid ${on ? f.color + "40" : T.border}`, textAlign: "left" }}>
                  <Avatar f={f} size={24} T={T} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: on ? f.color : T.text, fontFamily: "'Syne',sans-serif" }}>{f.name}</div>
                    <div style={{ fontSize: 10, color: T.textLo }}>{f.id === 1 ? "you" : f.email.split("@")[0]}</div>
                  </div>
                  {on && (
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: f.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width={7} height={7} viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth={2}><path d="M2 5l2 2 4-4" /></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => { if (!ok) return; onCreate({ name, dest, cover, month, year, memberIds: sel }); onClose(); }}
          style={{ width: "100%", padding: "11px", borderRadius: 9, fontSize: 13, background: ok ? T.violet : T.border, border: "none", color: ok ? "#fff" : T.textLo, fontWeight: 600, cursor: ok ? "pointer" : "default", fontFamily: "'Syne',sans-serif" }}>
          Create trip &amp; send invites
        </button>
      </div>
    </div>
  );
}
