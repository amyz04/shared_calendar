import { useState, useRef } from "react";
import type { CalendarSource } from "../../types";
import { Pill } from "../ui";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileTabs, type ProfileTab } from "./ProfileTabs";
import { inputCls } from "../ui/inputStyle";
import { getUser } from "../../api/auth";
import { importCalendarApi, deleteCalendarApi } from "../../api/calendar";
import { useTrips } from "../../context/TripContext";
import { MONTHS } from "../../data";

interface ProfilePanelProps {
  onClose: () => void;
  calendars: CalendarSource[];
  onAddCalendar: (c: CalendarSource) => void;
  onRemoveCalendar: (id: string) => void;
  onLogout: () => void;
}

export function ProfilePanel({
  onClose,
  calendars,
  onAddCalendar,
  onRemoveCalendar,
  onLogout,
}: ProfilePanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<ProfileTab>("calendars");
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const { trips } = useTrips();
  const savedUser = getUser();

  const [firstName, setFirstName] = useState(savedUser?.firstName ?? "");
  const [lastName, setLastName] = useState(savedUser?.lastName ?? "");
  const [email, setEmail] = useState(savedUser?.email ?? "");
  const [avatarColor, setAvatarColor] = useState(
    savedUser?.avatarColor ?? "#8b5cf6",
  );
  const [dob, setDob] = useState(savedUser?.dateOfBirth ?? "");

  async function handleFile(
    file: File,
    source: "google" | "apple" | "manual" = "manual",
  ) {
    if (!file.name.endsWith(".ics")) {
      setImportError("Please upload a .ics file");
      return;
    }
    try {
      setImporting(true);
      setImportError(null);
      const name = file.name.replace(".ics", "");
      const calendar = await importCalendarApi(file, name, source);
      onAddCalendar(calendar);
    } catch (err: any) {
      setImportError(err.message || "Failed to import calendar");
    } finally {
      setImporting(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      await deleteCalendarApi(id);
      onRemoveCalendar(id);
    } catch (err: any) {
      console.error("Failed to delete calendar:", err.message);
    }
  }

  const sourceColor = (source: string) =>
    source === "google" ? "#4285f4" : source === "apple" ? "#555" : "#94a3b8";

  return (
    <>
      <div className="fixed inset-0 bg-black/35 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[400px] bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 z-50 flex flex-col">
        {/* Header */}
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
          {/* Overview tab */}
          {tab === "overview" && (
            <div>
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {[
                  [trips.length, "Trips", "#8b5cf6"],
                  [0, "Friends", "#2dd4bf"],
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
              {trips.length === 0 ? (
                <div className="text-[13px] text-slate-400 dark:text-slate-600 font-syne text-center py-6">
                  No trips yet
                </div>
              ) : (
                trips.map((t) => (
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
                        {t.dest} · {MONTHS[t.month]?.slice(0, 3)} {t.year}
                      </div>
                    </div>
                    <Pill color="#2dd4bf">{t.status}</Pill>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Calendars tab */}
          {tab === "calendars" && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2.5">
                IMPORT .ICS FILE
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-600 mb-3 leading-relaxed">
                Export your calendar from Google (Settings → Export) or Apple
                (File → Export) and upload the .ics file below.
              </p>

              {/* Drag and drop zone */}
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
                className={`rounded-xl p-5 text-center cursor-pointer border-2 border-dashed transition-all mb-3 ${
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
                {importing ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                    <div className="text-[13px] text-violet-500 font-syne">
                      Importing...
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl mb-2">📅</div>
                    <div
                      className={`text-[13px] font-semibold font-syne mb-1 ${dragOver ? "text-violet-500" : "text-slate-900 dark:text-slate-100"}`}
                    >
                      {dragOver ? "Release to import" : "Drop .ics file here"}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-600">
                      or click to browse
                    </div>
                  </>
                )}
              </div>

              {/* Source selector buttons */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {(["google", "apple"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => fileRef.current?.click()}
                    style={{ borderColor: `${sourceColor(p)}40` }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-left cursor-pointer hover:border-slate-300 transition-all"
                  >
                    <div
                      style={{
                        backgroundColor: `${sourceColor(p)}18`,
                        color: sourceColor(p),
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold font-syne shrink-0"
                    >
                      {p === "google" ? "G" : ""}
                    </div>
                    <div>
                      <div className="text-[12px] font-medium text-slate-900 dark:text-slate-100 font-syne">
                        {p === "google" ? "Google Calendar" : "Apple Calendar"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Upload .ics
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {importError && (
                <p className="text-xs text-red-400 mb-3 font-syne">
                  {importError}
                </p>
              )}

              {/* Connected calendars list */}
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
                        style={{ backgroundColor: sourceColor(c.source) }}
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                      />
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-slate-900 dark:text-slate-100 font-syne">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-600 capitalize">
                          {c.source}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(c.id)}
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

          {/* Settings tab */}
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

              <div className="pt-5 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[13px] font-syne cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  >
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Log out
                </button>
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
