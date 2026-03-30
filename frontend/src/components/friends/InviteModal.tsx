import { useState } from "react";
import { inputCls } from "../ui/inputStyle";

interface InviteModalProps {
  onClose: () => void;
}

export function InviteModal({ onClose }: InviteModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const ok = name.trim() !== "" && email.trim().includes("@");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7 w-[400px]">
        {sent ? (
          <div className="text-center py-3">
            <div className="w-13 h-13 rounded-full bg-green-400/10 border border-green-400/40 flex items-center justify-center mx-auto mb-4">
              <svg
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4ade80"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100 font-syne mb-1.5">
              Invite sent!
            </div>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
              We sent an invite to{" "}
              <strong className="text-slate-900 dark:text-slate-100">
                {email}
              </strong>
              .
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-[13px] font-semibold font-syne border-none cursor-pointer transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-[17px] font-bold text-slate-900 dark:text-slate-100 font-syne m-0">
                  Invite a friend
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  They'll get an email to join voyage
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-transparent border-none text-slate-500 text-xl cursor-pointer leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-3 mb-5">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">
                  Their name
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan"
                  className={inputCls}
                />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">
                  Their email
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="friend@email.com"
                  type="email"
                  className={inputCls}
                />
              </div>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg bg-transparent border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[13px] font-syne cursor-pointer transition-all hover:border-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => ok && setSent(true)}
                disabled={!ok}
                className={`flex-[2] py-2.5 rounded-lg text-[13px] font-semibold font-syne flex items-center justify-center gap-1.5 border-none transition-all
                  ${ok ? "bg-violet-500 hover:bg-violet-600 text-white cursor-pointer" : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-default"}`}
              >
                <svg
                  width={13}
                  height={13}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
                Send invite
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
