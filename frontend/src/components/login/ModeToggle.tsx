export type AuthMode = "login" | "register";

interface ModeToggleProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6 border border-slate-200 dark:border-slate-700">
      {(["login", "register"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`flex-1 py-2 rounded-lg text-[13px] font-syne transition-all cursor-pointer border-none
            ${
              mode === m
                ? "bg-violet-500 text-white font-semibold shadow-sm"
                : "bg-transparent text-slate-500 dark:text-slate-400 font-normal"
            }`}
        >
          {m === "login" ? "Sign in" : "Create account"}
        </button>
      ))}
    </div>
  );
}
