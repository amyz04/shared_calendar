import { useState, useRef } from "react";
import { importCalendarApi } from "../../api/calendar";
import type { CalendarSource } from "../../types";
import { inputCls } from "../ui/inputStyle";

interface CalendarImportModalProps {
  onClose: () => void;
  onImport: (calendar: CalendarSource) => void;
}

const SOURCES = [
  {
    id: "google",
    label: "Google Calendar",
    instructions: "Go to Google Calendar → Settings → Export",
  },
  {
    id: "apple",
    label: "Apple Calendar",
    instructions: "Open Calendar app → File → Export → Export...",
  },
] as const;

export function CalendarImportModal({
  onClose,
  onImport,
}: CalendarImportModalProps) {
  const [source, setSource] = useState<"google" | "apple">("google");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const ok = file !== null && name.trim() != "";

  async function handleImport() {
    if (!ok) return;
    try {
      setLoading(true);
      setError(null);
      const calendar = await importCalendarApi(file!, name, source);
      onImport(calendar);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to import calendar");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7 w-[480px] max-h-[88vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 font-syne m-0">
            Import calendar
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-slate-500 text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Source picker */}
        <div className="mb-4">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-syne mb-2 font-medium">
            Calendar source
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SOURCES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSource(s.id)}
                className={`px-4 py-3 rounded-xl border text-left cursor-pointer transition-all ${
                  source === s.id
                    ? "bg-violet-500/10 border-violet-500 text-violet-500"
                    : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                <div className="text-[13px] font-semibold font-syne">
                  {s.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-4 px-3.5 py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-syne mb-1 font-medium">
            How to export
          </div>
          <div className="text-[12px] text-slate-600 dark:text-slate-300">
            {SOURCES.find((s) => s.id === source)?.instructions}
          </div>
        </div>

        {/* Calendar name */}
        <div className="mb-4">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-syne mb-1.5 font-medium">
            Calendar name
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Google Calendar"
            className={inputCls}
          />
        </div>

        {/* File upload */}
        <div className="mb-5">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-syne mb-1.5 font-medium">
            .ics file
          </div>
          <div
            onClick={() => fileRef.current?.click()}
            className={`w-full py-6 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center gap-2 transition-all ${
              file
                ? "border-violet-500 bg-violet-500/5"
                : "border-slate-200 dark:border-slate-700 hover:border-violet-500/50"
            }`}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={file ? "#8b5cf6" : "#94a3b8"}
              strokeWidth={1.8}
              strokeLinecap="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <div
              className={`text-[13px] font-syne font-medium ${file ? "text-violet-500" : "text-slate-400"}`}
            >
              {file ? file.name : "Click to upload .ics file"}
            </div>
            {!file && (
              <div className="text-[11px] text-slate-400">
                Exported from Google or Apple Calendar
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".ics"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 mb-3 font-syne">{error}</p>
        )}

        <button
          onClick={handleImport}
          disabled={!ok || loading}
          className={`w-full py-2.5 rounded-lg text-[13px] font-semibold font-syne border-none transition-all ${
            ok && !loading
              ? "bg-violet-500 hover:bg-violet-600 text-white cursor-pointer"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-default"
          }`}
        >
          {loading ? "Importing..." : "Import calendar"}
        </button>
      </div>
    </div>
  );
}
