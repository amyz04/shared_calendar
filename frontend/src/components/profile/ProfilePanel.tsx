import { useState, useRef, useEffect } from "react";
import type { CalendarSource } from "../../types";
import { Pill } from "../ui";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileTabs, type ProfileTab } from "./ProfileTabs";
import { inputCls } from "../ui/inputStyle";
import { getUser, saveUser } from "../../api/auth";
import { importCalendarApi } from "../../api/calendar";
import { useTrips } from "../../context/TripContext";
import { MONTHS } from "../../data";
import { useCalendars } from "../../context/CalendarContext";
import { updateProfileApi } from "../../api/user";
import { getFriendships } from "../../api/friends";

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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [friendCount, setFriendCount] = useState(0);

  const { trips } = useTrips();
  const savedUser = getUser();

  const [firstName, setFirstName] = useState(savedUser?.firstName ?? "");
  const [lastName, setLastName] = useState(savedUser?.lastName ?? "");
  const [email, setEmail] = useState(savedUser?.email ?? "");
  const [avatarColor, setAvatarColor] = useState(savedUser?.avatarColor ?? "#8b5cf6");
  const [dob, setDob] = useState(savedUser?.dateOfBirth ?? "");
  const { removeCalendar } = useCalendars();

  useEffect(() => {
    getFriendships()
      .then((data) => {
        const accepted = data.filter((f: any) => f.status === "ACCEPTED").length;
        setFriendCount(accepted);
      })
      .catch(() => {});
  }, []);

  async function handleColorChange(color: string) {
    setAvatarColor(color);
    try {
      const updated = await updateProfileApi({ avatarColor: color });
      saveUser(updated);
    } catch {
      // silent fail
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setSaveError("");
      const updated = await updateProfileApi({
        firstName,
        lastName,
        email,
        avatarColor,
        dateOfBirth: dob || undefined,
      });
      saveUser(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      setSaveError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleFile(file: File) {
    if (!file.name.endsWith(".ics")) {
      setImportError("Please upload a .ics file");
      return;
    }
    try {
      setImporting(true);
      setImportError(null);
      const name = file.name.replace(".ics", "");
      const calendar = await importCalendarApi(file, name);
      onAddCalendar(calendar);
    } catch (err: any) {
      setImportError(err.message || "Failed to import calendar");
    } finally {
      setImporting(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/35 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[400px] bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 z-50 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-syne">Profile</span>
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
          onColorChange={handleColorChange}
        />
        <ProfileTabs tab={tab} onChange={setTab} />

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Overview tab */}
          {tab === "overview" && (
            <div>
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {[
                  [trips.length, "Trips", "#8b5cf6"],
                  [friendCount, "Friends", "#2dd4bf"],
                  [calendars.length, "Calendars", "#4ade80"],
                ].map(([v, l, c]) => (
                  <div
                    key={l as string}
                    className="text-center py-3.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div style={{ color: c as string }} className="text-[22px] font-bold font-syne">
                      {v as number}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-600 mt-0.5">{l as string}</div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2.5">UPCOMING</div>
              {trips.length === 0 ? (
                <div className="text-[13px] text-slate-400 dark:text-slate-600 font-syne text-center py-6">No trips yet</div>
              ) : (
                trips.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xl">{t.cover}</span>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">{t.name}</div>
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

          {tab === "calendars" && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2.5">IMPORT CALENDAR</div>
              <p className="text-[11px] text-slate-400 dark:text-slate-600 mb-3 leading-relaxed">
                Export your calendar from Google (Settings → Export) or Apple (File → Export) and drop the .ics file below.
              </p>

              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                className={`rounded-xl p-5 text-center cursor-pointer border-2 border-dashed transition-all mb-5 ${
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
                    <div className="text-[13px] text-violet-500 font-syne">Importing...</div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl mb-2">📅</div>
                    <div className={`text-[13px] font-semibold font-syne mb-1 ${dragOver ? "text-violet-500" : "text-slate-900 dark:text-slate-100"}`}>
                      {dragOver ? "Release to import" : "Drop .ics file here"}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-600">or click to browse</div>
                  </>
                )}
              </div>

              {importError && <p className="text-xs text-red-400 mb-3 font-syne">{importError}</p>}

              {calendars.length > 0 && (
                <>
                  <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-2.5">YOUR CALENDARS</div>
                  {calendars.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0" />
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-slate-900 dark:text-slate-100 font-syne">{c.name}</div>
                      </div>
                      <button
                        onClick={() => removeCalendar(c.id)}
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
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne mb-3">ACCOUNT INFO</div>
              <div className="flex flex-col gap-3 mb-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">First name</div>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">Last name</div>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">Email</div>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">Date of birth</div>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className={inputCls}
                  />
                </div>
              </div>

              {saveError && <p className="text-xs text-red-400 font-syne mb-3">{saveError}</p>}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-2.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-[13px] font-semibold font-syne border-none cursor-pointer transition-all mb-6 disabled:opacity-50"
              >
                {saving ? "Saving..." : saveSuccess ? "Saved ✓" : "Save changes"}
              </button>

              <div className="pt-5 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[13px] font-syne cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
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