import { useState, useRef, useEffect } from "react";
import type { EventItem } from "./tripUtils";
import { fmtDate } from "./tripUtils";

interface AddEventModalProps {
  date: string;
  onClose: () => void;
  onAdd: (e: Omit<EventItem, "id" | "createdBy">) => void;
}

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [h, m] = value.split(":").map(Number);
  const [hInput, setHInput] = useState(String(h).padStart(2, "0"));
  const [mInput, setMInput] = useState(String(m).padStart(2, "0"));
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    if (hourRef.current) {
      const btn = hourRef.current.children[h] as HTMLElement;
      if (btn) btn.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [h]);

  useEffect(() => {
    if (minRef.current) {
      const btn = minRef.current.children[m] as HTMLElement;
      if (btn) btn.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [m]);

  function handleHourInput(raw: string) {
    if (!/^\d{0,2}$/.test(raw)) return;
    const num = parseInt(raw || "0");
    if (raw.length === 2 && num > 23) return;
    setHInput(raw);
    if (!isNaN(num) && num >= 0 && num <= 23) {
      onChange(`${String(num).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }

  function handleMinInput(raw: string) {
    if (!/^\d{0,2}$/.test(raw)) return;
    const num = parseInt(raw || "0");
    if (raw.length === 2 && num > 59) return;
    setMInput(raw);
    if (!isNaN(num) && num >= 0 && num <= 59) {
      onChange(`${String(h).padStart(2, "0")}:${String(num).padStart(2, "0")}`);
    }
  }

  function handleHourBlur() {
    setHInput(String(h).padStart(2, "0"));
  }

  function handleMinBlur() {
    setMInput(String(m).padStart(2, "0"));
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl overflow-hidden">
      <div className="flex items-center justify-center gap-1 px-3 py-2 border-b border-slate-700/40 bg-slate-900/40">
        <input
          value={hInput}
          onChange={e => handleHourInput(e.target.value)}
          onBlur={handleHourBlur}
          onFocus={e => e.target.select()}
          maxLength={2}
          className="w-10 text-center py-1 rounded-lg bg-slate-700/60 border border-slate-600/60 text-violet-300 text-sm font-bold font-syne outline-none focus:border-violet-500/60 transition-colors"
        />
        <span className="text-slate-500 font-bold font-syne">:</span>
        <input
          value={mInput}
          onChange={e => handleMinInput(e.target.value)}
          onBlur={handleMinBlur}
          onFocus={e => e.target.select()}
          maxLength={2}
          className="w-10 text-center py-1 rounded-lg bg-slate-700/60 border border-slate-600/60 text-violet-300 text-sm font-bold font-syne outline-none focus:border-violet-500/60 transition-colors"
        />
      </div>

      <div className="flex gap-0">
        <div ref={hourRef} className="flex-1 overflow-y-auto max-h-[120px] scrollbar-hide py-1">
          {hours.map(hr => (
            <button
              key={hr}
              onClick={() => {
                onChange(`${String(hr).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
                setHInput(String(hr).padStart(2, "0"));
              }}
              className={`w-full py-1.5 text-center text-xs font-syne rounded-lg transition-all ${
                hr === h ? "bg-violet-500 text-white font-bold" : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {String(hr).padStart(2, "0")}
            </button>
          ))}
        </div>
        <div className="w-px bg-slate-700/60 my-1" />
        <div ref={minRef} className="flex-1 overflow-y-auto max-h-[120px] scrollbar-hide py-1">
          {minutes.map(mn => (
            <button
              key={mn}
              onClick={() => {
                onChange(`${String(h).padStart(2, "0")}:${String(mn).padStart(2, "0")}`);
                setMInput(String(mn).padStart(2, "0"));
              }}
              className={`w-full py-1.5 text-center text-xs font-syne rounded-lg transition-all ${
                mn === m ? "bg-violet-500 text-white font-bold" : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {String(mn).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AddEventModal({ date, onClose, onAdd }: AddEventModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [scope, setScope] = useState<"GROUP" | "PERSONAL">("GROUP");

  const [sh, sm] = time.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  const timeValid = endMins > startMins;
  const ok = name.trim() !== "" && timeValid;

  const is = "w-full px-3.5 py-2.5 rounded-xl text-[13px] bg-slate-800/60 border border-slate-700/60 text-slate-100 outline-none font-syne placeholder:text-slate-600 focus:border-violet-500/50 transition-colors";

  function getDuration() {
    const mins = endMins - startMins;
    if (mins <= 0) return "End must be after start";
    const hr = Math.floor(mins / 60);
    const mn = mins % 60;
    return hr > 0 ? `${hr}h${mn > 0 ? ` ${mn}m` : ""} duration` : `${mn}m duration`;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[999]">
      <div
        className="relative w-[420px] max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700/50 shadow-2xl"
        style={{ background: "linear-gradient(145deg, #1e2130 0%, #161822 100%)" }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[18px] font-bold text-slate-100 font-syne m-0 tracking-tight">Add event</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                <p className="text-[11px] text-slate-500 font-syne">{fmtDate(date)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-500 hover:text-slate-200 hover:border-slate-500 flex items-center justify-center cursor-pointer transition-all"
            >
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-[10px] text-slate-500 mb-1.5 block font-semibold font-syne tracking-widest uppercase">Event name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Train to Sintra"
                autoFocus
                className={is}
              />
            </div>

            {/* Time pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 mb-1.5 block font-semibold font-syne tracking-widest uppercase">
                  Start — <span className="text-violet-400">{time}</span>
                </label>
                <TimePicker value={time} onChange={setTime} />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 mb-1.5 block font-semibold font-syne tracking-widest uppercase">
                  End — <span className="text-violet-400">{endTime}</span>
                </label>
                <TimePicker value={endTime} onChange={setEndTime} />
              </div>
            </div>

            {/* Duration hint */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              timeValid ? "bg-slate-800/40 border-slate-700/40" : "bg-red-500/10 border-red-500/30"
            }`}>
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={timeValid ? "#8b5cf6" : "#f87171"} strokeWidth={2} strokeLinecap="round">
                <circle cx={12} cy={12} r={10} /><path d="M12 6v6l4 2" />
              </svg>
              <span className={`text-[11px] font-syne ${timeValid ? "text-slate-500" : "text-red-400"}`}>
                {getDuration()}
              </span>
            </div>

            {/* Location */}
            <div>
              <label className="text-[10px] text-slate-500 mb-1.5 block font-semibold font-syne tracking-widest uppercase">Location</label>
              <div className="relative">
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx={12} cy={10} r={3} />
                </svg>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Rossio station"
                  className={`${is} pl-9`}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[10px] text-slate-500 mb-1.5 block font-semibold font-syne tracking-widest uppercase">Notes</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Optional details..."
                rows={2}
                className={`${is} resize-none`}
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="text-[10px] text-slate-500 mb-1.5 block font-semibold font-syne tracking-widest uppercase">Visibility</label>
              <div className="grid grid-cols-2 gap-2">
                {(["GROUP", "PERSONAL"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setScope(s)}
                    className={`py-2.5 rounded-xl text-xs font-semibold font-syne border transition-all flex items-center justify-center gap-2 ${
                      scope === s
                        ? s === "GROUP"
                          ? "bg-violet-500/15 text-violet-400 border-violet-500/40"
                          : "bg-slate-700/60 text-slate-200 border-slate-500/60"
                        : "bg-transparent text-slate-600 border-slate-700/60 hover:border-slate-600 hover:text-slate-400"
                    }`}
                  >
                    <span className="text-sm">{s === "GROUP" ? "👥" : "🔒"}</span>
                    {s === "GROUP" ? "Group" : "Personal"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 mt-6 pt-5 border-t border-slate-700/40">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-transparent border border-slate-700/60 text-slate-500 hover:text-slate-300 hover:border-slate-600 text-[13px] font-syne cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => { if (!ok) return; onAdd({ name, location, description, time, endTime, scope }); onClose(); }}
              className={`flex-[2] py-2.5 rounded-xl text-[13px] font-semibold font-syne border-none transition-all ${
                ok
                  ? "bg-violet-500 hover:bg-violet-400 text-white cursor-pointer shadow-lg shadow-violet-500/20"
                  : "bg-slate-800 text-slate-600 cursor-default"
              }`}
            >
              {!name.trim() ? "Enter a name first" : !timeValid ? "End must be after start" : "Add event →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}