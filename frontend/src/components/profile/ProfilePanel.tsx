import { useState, useRef } from "react";
import type { CalendarSource } from "../../types";
import { Pill } from "../ui";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileTabs, type ProfileTab } from "./ProfileTabs";
import { FRIENDS, MONTHS, INIT_TRIPS } from "../../data";
import { inputCls } from "../ui/inputStyle";

interface ProfilePanelProps {
  onClose: () => void;
  calendars: CalendarSource[];
  onAddCalendar: (c: CalendarSource) => void;
  onRemoveCalendar: (id: string) => void;
}

export function ProfilePanel({
  onClose,
  calendars,
  onAddCalendar,
  onRemoveCalendar,
}: ProfilePanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<ProfileTab>("calendars");
  const [dragOver, setDragOver] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Lee");
  const [email, setEmail] = useState("alex@email.com");
  const [avatarColor, setAvatarColor] = useState("#8b5cf6");
  const [dob, setDob] = useState("");

  function handleFile(file: File) {
    if (!file.name.endsWith(".ics")) return;
    onAddCalendar({
      id: `ics-${Date.now()}`,
      name: file.name.replace(".ics", ""),
      source: "ics",
      eventCount: Math.floor(Math.random() * 30) + 5,
      color: "#94a3b8",
    });
  }

  function handleConnect(p: "google" | "apple") {
    setConnecting(p);
    setTimeout(() => {
      onAddCalendar({
        id: `${p}-${Date.now()}`,
        name: p === "google" ? "Google Calendar" : "Apple Calendar",
        source: p,
        eventCount: Math.floor(Math.random() * 60) + 20,
        color: p === "google" ? "#4285f4" : "#555",
      });
      setConnecting(null);
    }, 1500);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/35 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[400px] bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 z-50 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-syne">
            Profile
          </span>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-slate-500 text-xl cursor-pointer leading-none hover:text-slate-900 dark:hover:text-slate-100"
          >
            ×
          </button>
        </div>

        <ProfileAvatar
          firstName={firstName}
          lastName={lastName}
          email={email}
          avatarColor={avatarColor}
          onColorChange={setAvatarColor}
        />
        <ProfileTabs tab={tab} onChange={setTab} />

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === "overview" && (
            <div>
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {[
                  [INIT_TRIPS.length, "Trips", "#8b5cf6"],
                  [FRIENDS.length, "Friends", "#2dd4bf"],
                  [calendars.length, "Calendars", "#4ade80"],
                ].map(([v, l, c]) => (
                  <div
                    key={l as string}
                    className="text-center py-3.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div
                      style={{ color: c as string }}
                      className="text-[22px] font-bold font-syne"
                    >
                      {v as number}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-600 mt-0.5">
                      {l as string}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2.5">
                UPCOMING
              </div>
              {INIT_TRIPS.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 py-2.5 border-b border-slate-200 dark:border-slate-700"
                >
                  <span className="text-xl">{t.cover}</span>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                      {t.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t.dest} · {MONTHS[t.month].slice(0, 3)} {t.year}
                    </div>
                  </div>
                  <Pill color="#2dd4bf">{t.status}</Pill>
                </div>
              ))}
            </div>
          )}

          {tab === "calendars" && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2.5">
                CONNECT ACCOUNT
              </div>
              <div className="flex flex-col gap-2 mb-5">
                {(["google", "apple"] as const).map((p) => {
                  const has = calendars.some((c) => c.source === p);
                  const loading = connecting === p;
                  const label =
                    p === "google" ? "Google Calendar" : "Apple Calendar";
                  const color = p === "google" ? "#4285f4" : "#888";
                  return (
                    <button
                      key={p}
                      onClick={() => !has && handleConnect(p)}
                      disabled={has || loading}
                      style={{ borderColor: has ? `${color}40` : undefined }}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border text-left transition-all
                        ${!has && !loading ? "border-slate-200 dark:border-slate-700 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600" : "cursor-default border-slate-200 dark:border-slate-700"}`}
                    >
                      <div
                        style={{
                          backgroundColor: `${color}18`,
                          borderColor: `${color}30`,
                          color,
                        }}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 text-[13px] font-bold font-syne"
                      >
                        {p === "google" ? "G" : ""}
                      </div>
                      <div className="flex-1">
                        <div
                          style={{ color: has ? color : undefined }}
                          className={`text-[13px] font-medium font-syne ${!has ? "text-slate-900 dark:text-slate-100" : ""}`}
                        >
                          {label}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-600">
                          {has
                            ? "Connected"
                            : loading
                              ? "Connecting..."
                              : "Click to connect"}
                        </div>
                      </div>
                      {has ? (
                        <Pill color="#4ade80">live</Pill>
                      ) : loading ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                      ) : (
                        <span className="text-violet-500">→</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2.5">
                IMPORT .ICS FILE
              </div>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                className={`rounded-xl p-5 text-center cursor-pointer border-2 border-dashed transition-all mb-5
                  ${
                    dragOver
                      ? "border-violet-500 bg-violet-500/5"
                      : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".ics"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
                <div className="text-2xl mb-2">📅</div>
                <div
                  className={`text-[13px] font-semibold font-syne mb-1 ${dragOver ? "text-violet-500" : "text-slate-900 dark:text-slate-100"}`}
                >
                  {dragOver ? "Release to import" : "Drop .ics file here"}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-600">
                  or click to browse
                </div>
              </div>

              {calendars.length > 0 && (
                <>
                  <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2.5">
                    YOUR CALENDARS
                  </div>
                  {calendars.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2"
                    >
                      <div
                        style={{ backgroundColor: c.color }}
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                      />
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-slate-900 dark:text-slate-100 font-syne">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-600">
                          {c.eventCount} events
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveCalendar(c.id)}
                        className="bg-transparent border-none text-slate-400 cursor-pointer text-base transition-colors hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {tab === "settings" && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-3">
                ACCOUNT INFO
              </div>
              <div className="flex flex-col gap-3 mb-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">
                      First name
                    </div>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">
                      Last name
                    </div>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">
                    Email
                  </div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">
                    Date of birth
                  </div>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className={inputCls}
                  />
                </div>
              </div>
              <button className="w-full py-2.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-[13px] font-semibold font-syne border-none cursor-pointer transition-all mb-6">
                Save changes
              </button>
              <div className="pt-5 border-t border-slate-200 dark:border-slate-700">
                <button className="w-full py-2.5 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-[13px] font-syne cursor-pointer hover:bg-red-400/20 transition-all">
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
