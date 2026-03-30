export type ProfileTab = "overview" | "calendars" | "settings";

interface ProfileTabsProps {
  tab: ProfileTab;
  onChange: (t: ProfileTab) => void;
}

export function ProfileTabs({ tab, onChange }: ProfileTabsProps) {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-700 shrink-0">
      {(["overview", "calendars", "settings"] as const).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`flex-1 py-2.5 bg-transparent border-none text-xs font-syne cursor-pointer capitalize transition-all border-b-2
            ${
              tab === t
                ? "border-violet-500 text-violet-500 font-semibold"
                : "border-transparent text-slate-500 dark:text-slate-400 font-normal hover:text-slate-700 dark:hover:text-slate-300"
            }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
