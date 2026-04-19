import { ThemeToggle } from "../ui/ThemeToggle";

interface SidebarBrandProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function SidebarBrand({ isDark, toggleTheme }: SidebarBrandProps) {
  return (
    <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth={2.2}
            strokeLinecap="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight">
          GYST
        </span>
      </div>
      <ThemeToggle isDark={isDark} toggle={toggleTheme} />
    </div>
  );
}
