import { useState } from "react";
import type { EventItem } from "./tripUtils";
import { fmtDate } from "./tripUtils";

interface AddEventModalProps {
  date: string;
  onClose: () => void;
  onAdd: (e: Omit<EventItem, "id" | "createdBy">) => void;
}

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [h, m] = value.split(":").map(Number);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="flex gap-1 bg-slate-800/60 border border-slate-700/60 rounded-xl p-1 overflow-hidden">
      {/* Hours */}
      <div className="flex-1 overflow-y-auto max-h-[120px] scrollbar-hide">
        {hours.map(hr => (
          <button
            key={hr}
            onClick={() => onChange(`${String(hr).padStart(2, "0")}:${String(m).padStart(2, "0")}`)}
            className={`w-full py-1.5 text-center text-xs font-syne rounded-lg transition-all ${
              hr === h ? "bg-violet-500 text-white font-bold" : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            {String(hr).padStart(2, "0")}
          </button>
        ))}
      </div>
      <div className="w-px bg-slate-700/60 my-1" />
      {/* Minutes */}
      <div className="flex-1 overflow-y-auto max-h-[120px] scrollbar-hide">
        {minutes.map(mn => (
          <button
            key={mn}
            onClick={() => onChange(`${String(h).padStart(2, "0")}:${String(mn).padStart(2, "0")}`)}
            className={`w-full py-1.5 text-center text-xs font-syne rounded-lg transition-all ${
              mn === m ? "bg-violet-500 text-white font-bold" : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            {String(mn).padStart(2, "0")}
          </button>
        ))}
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

  const ok = name.trim() !== "";

  const is = "w-full px-3.5 py-2.5 rounded-xl text-[13px] bg-slate-800/60 border border-slate-700/60 text-slate-100 outline-none font-syne placeholder:text-slate-600 focus:border-violet-500/50 transition-colors";

  function getDuration() {
    const [sh, sm] = time.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    if (mins <= 0) return "Set end after start";
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
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-500 hover:text-slate-200 hover:border-slate-500 flex items-center justify-center cursor-pointer transition-all">
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-[10px] text-slate-500 mb-1.5 block font-semibold font-syne tracking-widest uppercase">Event name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Train to Sintra" autoFocus className={is} />
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
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/40">
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round">
                <circle cx={12} cy={12} r={10} /><path d="M12 6v6l4 2" />
              </svg>
              <span className="text-[11px] text-slate-500 font-syne">{getDuration()}</span>
            </div>

            {/* Location */}
            <div>
              <label className="text-[10px] text-slate-500 mb-1.5 block font-semibold font-syne tracking-widest uppercase">Location</label>
              <div className="relative">
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx={12} cy={10} r={3} />
                </svg>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Rossio station" className={`${is} pl-9`} />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[10px] text-slate-500 mb-1.5 block font-semibold font-syne tracking-widest uppercase">Notes</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional details..." rows={2} className={`${is} resize-none`} />
            </div>

            {/* Visibility */}
            <div>
              <label className="text-[10px] text-slate-500 mb-1.5 block font-semibold font-syne tracking-widest uppercase">Visibility</label>
              <div className="grid grid-cols-2 gap-2">
                {(["GROUP", "PERSONAL"] as const).map(s => (
                  <button key={s} onClick={() => setScope(s)}
                    className={`py-2.5 rounded-xl text-xs font-semibold font-syne border transition-all flex items-center justify-center gap-2 ${
                      scope === s
                        ? s === "GROUP" ? "bg-violet-500/15 text-violet-400 border-violet-500/40" : "bg-slate-700/60 text-slate-200 border-slate-500/60"
                        : "bg-transparent text-slate-600 border-slate-700/60 hover:border-slate-600 hover:text-slate-400"
                    }`}>
                    <span className="text-sm">{s === "GROUP" ? "👥" : "🔒"}</span>
                    {s === "GROUP" ? "Group" : "Personal"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 mt-6 pt-5 border-t border-slate-700/40">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-transparent border border-slate-700/60 text-slate-500 hover:text-slate-300 hover:border-slate-600 text-[13px] font-syne cursor-pointer transition-all">
              Cancel
            </button>
            <button
              onClick={() => { if (!ok) return; onAdd({ name, location, description, time, endTime, scope }); onClose(); }}
              className={`flex-[2] py-2.5 rounded-xl text-[13px] font-semibold font-syne border-none transition-all ${ok ? "bg-violet-500 hover:bg-violet-400 text-white cursor-pointer shadow-lg shadow-violet-500/20" : "bg-slate-800 text-slate-600 cursor-default"}`}>
              {ok ? "Add event →" : "Enter a name first"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}