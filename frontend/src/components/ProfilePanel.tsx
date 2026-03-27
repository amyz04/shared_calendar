import { useState, useRef } from "react";
import type { CalendarSource } from "../types";
import type { Theme } from "../theme";
import { Pill } from "./UI";
import { FRIENDS, MONTHS, INIT_TRIPS } from "../data";

interface ProfilePanelProps {
  onClose: () => void;
  calendars: CalendarSource[];
  onAddCalendar: (c: CalendarSource) => void;
  onRemoveCalendar: (id: string) => void;
  T: Theme;
}

export function ProfilePanel({ onClose, calendars, onAddCalendar, onRemoveCalendar, T }: ProfilePanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"overview" | "calendars" | "settings">("calendars");
  const [dragOver, setDragOver] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Lee");
  const [email, setEmail] = useState("alex@email.com");
  const [avatarColor, setAvatarColor] = useState("#8b5cf6");
  const COLORS = ["#8b5cf6", "#f87171", "#f59e0b", "#34d399", "#60a5fa", "#f472b6", "#fb923c", "#4ade80"];

  function handleFile(file: File) {
    if (!file.name.endsWith(".ics")) return;
    onAddCalendar({ id: `ics-${Date.now()}`, name: file.name.replace(".ics", ""), source: "ics", eventCount: Math.floor(Math.random() * 30) + 5, color: "#94a3b8" });
  }

  function handleConnect(p: "google" | "apple") {
    setConnecting(p);
    setTimeout(() => {
      onAddCalendar({ id: `${p}-${Date.now()}`, name: p === "google" ? "Google Calendar" : "Apple Calendar", source: p, eventCount: Math.floor(Math.random() * 60) + 20, color: p === "google" ? "#4285f4" : "#555" });
      setConnecting(null);
    }, 1500);
  }

  const is = { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, background: T.bgAlt, border: `1px solid ${T.border}`, color: T.text, outline: "none", fontFamily: "'Syne',sans-serif" } as const;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40 }} onClick={onClose} />
      <div style={{ position: "fixed", top: 0, right: 0, height: "100%", width: 400, background: T.surface, borderLeft: `1px solid ${T.border}`, zIndex: 50, display: "flex", flexDirection: "column" }}>

        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>Profile</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textMd, fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${avatarColor}20`, border: `2px solid ${avatarColor}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 700, color: avatarColor, fontFamily: "'Syne',sans-serif", position: "relative", flexShrink: 0 }}>
              {firstName[0]}{lastName[0]}
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: T.green, border: `2px solid ${T.surface}` }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>{firstName} {lastName}</div>
              <div style={{ fontSize: 12, color: T.textMd }}>{email}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {COLORS.map(c => (
              <button key={c} onClick={() => setAvatarColor(c)} style={{ width: 20, height: 20, borderRadius: "50%", background: c, border: `2px solid ${avatarColor === c ? T.text : "transparent"}`, cursor: "pointer" }} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
          {(["overview", "calendars", "settings"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "11px 8px", background: "none", border: "none", borderBottom: `2px solid ${tab === t ? T.violet : "transparent"}`, color: tab === t ? T.violet : T.textMd, fontSize: 12, fontWeight: tab === t ? 600 : 400, cursor: "pointer", fontFamily: "'Syne',sans-serif", textTransform: "capitalize" }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}>

          {tab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
                {[[INIT_TRIPS.length, "Trips", T.violet], [FRIENDS.length, "Friends", T.teal], [calendars.length, "Calendars", T.green]].map(([v, l, c]) => (
                  <div key={l as string} style={{ textAlign: "center", padding: "14px 8px", borderRadius: 12, background: T.bgAlt, border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: c as string, fontFamily: "'Syne',sans-serif" }}>{v as number}</div>
                    <div style={{ fontSize: 11, color: T.textLo, marginTop: 3 }}>{l as string}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textLo, letterSpacing: "0.07em", fontFamily: "'Syne',sans-serif", marginBottom: 10 }}>UPCOMING</div>
              {INIT_TRIPS.map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 20 }}>{t.cover}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: "'Syne',sans-serif" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: T.textMd }}>{t.dest} · {MONTHS[t.month].slice(0, 3)} {t.year}</div>
                  </div>
                  <Pill color={T.teal} T={T}>{t.status}</Pill>
                </div>
              ))}
            </div>
          )}

          {tab === "calendars" && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textLo, letterSpacing: "0.07em", fontFamily: "'Syne',sans-serif", marginBottom: 10 }}>CONNECT ACCOUNT</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {(["google", "apple"] as const).map(p => {
                  const has = calendars.some(c => c.source === p);
                  const loading = connecting === p;
                  const label = p === "google" ? "Google Calendar" : "Apple Calendar";
                  const color = p === "google" ? "#4285f4" : "#888";
                  return (
                    <button key={p} onClick={() => !has && handleConnect(p)} disabled={has || loading}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: T.bgAlt, border: `1px solid ${has ? color + "40" : T.border}`, cursor: has ? "default" : "pointer", textAlign: "left" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 700, color, fontFamily: "'Syne',sans-serif" }}>
                        {p === "google" ? "G" : ""}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: has ? color : T.text, fontFamily: "'Syne',sans-serif" }}>{label}</div>
                        <div style={{ fontSize: 11, color: T.textLo }}>{has ? "Connected" : loading ? "Connecting..." : "Click to connect"}</div>
                      </div>
                      {has
                        ? <Pill color={T.green} T={T}>live</Pill>
                        : loading
                          ? <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${T.violet}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                          : <span style={{ color: T.violet }}>→</span>
                      }
                    </button>
                  );
                })}
              </div>

              <div style={{ fontSize: 11, fontWeight: 600, color: T.textLo, letterSpacing: "0.07em", fontFamily: "'Syne',sans-serif", marginBottom: 10 }}>IMPORT .ICS FILE</div>
              <div
                style={{ borderRadius: 12, padding: "22px 18px", textAlign: "center", cursor: "pointer", border: `1.5px dashed ${dragOver ? T.violet : T.border}`, background: dragOver ? T.violetSoft : T.bgAlt, marginBottom: 20 }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" accept=".ics" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                <div style={{ fontSize: 24, marginBottom: 8 }}>📅</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: dragOver ? T.violet : T.text, fontFamily: "'Syne',sans-serif", marginBottom: 4 }}>
                  {dragOver ? "Release to import" : "Drop .ics file here"}
                </div>
                <div style={{ fontSize: 11, color: T.textLo }}>or click to browse</div>
              </div>

              {calendars.length > 0 && (
                <>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.textLo, letterSpacing: "0.07em", fontFamily: "'Syne',sans-serif", marginBottom: 10 }}>YOUR CALENDARS</div>
                  {calendars.map(c => (
                    <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: T.bgAlt, border: `1px solid ${T.border}`, marginBottom: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: "'Syne',sans-serif" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: T.textLo }}>{c.eventCount} events</div>
                      </div>
                      <button onClick={() => onRemoveCalendar(c.id)} style={{ background: "none", border: "none", color: T.textLo, cursor: "pointer", fontSize: 16 }}
                        onMouseEnter={e => (e.currentTarget.style.color = T.coral)}
                        onMouseLeave={e => (e.currentTarget.style.color = T.textLo)}>×</button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {tab === "settings" && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textLo, letterSpacing: "0.07em", fontFamily: "'Syne',sans-serif", marginBottom: 12 }}>ACCOUNT INFO</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: T.textMd, marginBottom: 5, fontFamily: "'Syne',sans-serif" }}>First name</div>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} style={is} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: T.textMd, marginBottom: 5, fontFamily: "'Syne',sans-serif" }}>Last name</div>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} style={is} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: T.textMd, marginBottom: 5, fontFamily: "'Syne',sans-serif" }}>Email</div>
                  <input value={email} onChange={e => setEmail(e.target.value)} style={is} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: T.textMd, marginBottom: 5, fontFamily: "'Syne',sans-serif" }}>Date of birth</div>
                  <input type="date" style={{ ...is, colorScheme: T.isDark ? "dark" : "light" }} />
                </div>
              </div>
              <button style={{ width: "100%", padding: "10px", borderRadius: 9, background: T.violet, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne',sans-serif", marginBottom: 24 }}>
                Save changes
              </button>
              <div style={{ marginTop: 8, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
                <button style={{ width: "100%", padding: "10px", borderRadius: 9, background: `${T.coral}10`, border: `1px solid ${T.coral}30`, color: T.coral, fontSize: 13, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>
                  Delete account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
