import { useState } from "react";
import type { Trip } from "../../types";
import { Avatar } from "../ui";
import { FRIENDS, MONTHS, EMOJIS } from "../../data";
import { inputCls } from "../ui/inputStyle";

interface NewTripModalProps {
  onClose: () => void;
  onCreate: (d: Omit<Trip, "id" | "status">) => void;
}

export function NewTripModal({ onClose, onCreate }: NewTripModalProps) {
  const [name, setName] = useState("");
  const [dest, setDest] = useState("");
  const [cover, setCover] = useState("✈️");
  const [month, setMonth] = useState(5);
  const [year, setYear] = useState(2025);
  const [sel, setSel] = useState<number[]>([1]);

  const toggle = (id: number) => {
    if (id === 1) return;
    setSel((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };
  const ok = name.trim() !== "" && dest.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7 w-[500px] max-h-[88vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 font-syne m-0">
            Plan a new trip
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-slate-500 text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-syne mb-2 font-medium">
            Trip icon
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setCover(e)}
                className={`w-9 h-9 rounded-lg text-[17px] cursor-pointer border transition-all
                  ${
                    cover === e
                      ? "bg-violet-500/10 border-violet-500"
                      : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300"
                  }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {(
          [
            ["Trip name", name, setName, "e.g. Portugal Summer"],
            ["Destination", dest, setDest, "e.g. Lisbon"],
          ] as const
        ).map(([l, v, s, p]) => (
          <div key={l} className="mb-3.5">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium font-syne">
              {l}
            </div>
            <input
              value={v as string}
              onChange={(e) => (s as (v: string) => void)(e.target.value)}
              placeholder={p as string}
              className={inputCls}
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium font-syne">
              Month
            </div>
            <select
              value={month}
              onChange={(e) => setMonth(+e.target.value)}
              className={inputCls}
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium font-syne">
              Year
            </div>
            <select
              value={year}
              onChange={(e) => setYear(+e.target.value)}
              className={inputCls}
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-5">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-medium font-syne">
            Invite friends
          </div>
          <div className="grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto">
            {FRIENDS.map((f) => {
              const on = sel.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => toggle(f.id)}
                  style={
                    on
                      ? {
                          backgroundColor: `${f.color}10`,
                          borderColor: `${f.color}40`,
                        }
                      : undefined
                  }
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left border transition-all
                    ${f.id === 1 ? "cursor-default" : "cursor-pointer"}
                    ${!on ? "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300" : ""}`}
                >
                  <Avatar f={f} size={24} />
                  <div className="flex-1 min-w-0">
                    <div
                      style={on ? { color: f.color } : undefined}
                      className={`text-xs font-medium font-syne ${!on ? "text-slate-900 dark:text-slate-100" : ""}`}
                    >
                      {f.name}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-600">
                      {f.id === 1 ? "you" : f.email.split("@")[0]}
                    </div>
                  </div>
                  {on && (
                    <div
                      style={{ backgroundColor: f.color }}
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                    >
                      <svg
                        width={7}
                        height={7}
                        viewBox="0 0 10 10"
                        fill="none"
                        stroke="#fff"
                        strokeWidth={2}
                      >
                        <path d="M2 5l2 2 4-4" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            if (!ok) return;
            onCreate({ name, dest, cover, month, year, memberIds: sel });
            onClose();
          }}
          className={`w-full py-2.5 rounded-lg text-[13px] font-semibold font-syne border-none transition-all
            ${ok ? "bg-violet-500 hover:bg-violet-600 text-white cursor-pointer" : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-default"}`}
        >
          Create trip &amp; send invites
        </button>
      </div>
    </div>
  );
}
