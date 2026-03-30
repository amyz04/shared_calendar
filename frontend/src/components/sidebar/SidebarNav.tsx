// components/sidebar/SidebarNav.tsx
import { NAV_ITEMS } from "../../data";

interface SidebarNavProps {
  activePath: string;
  onNav: (path: string) => void;
}

export function SidebarNav({ activePath, onNav }: SidebarNavProps) {
  return (
    <div className="px-2.5 pt-2.5 pb-1.5">
      <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 tracking-widest font-syne px-2 mb-1">
        MENU
      </div>
      {NAV_ITEMS.map((n) => {
        const on = activePath === n.path; // ← was activePath === n.id
        return (
          <button
            key={n.path}
            onClick={() => onNav(n.path)}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-0.5 text-[13px] font-syne cursor-pointer border transition-all text-left
              ${
                on
                  ? "bg-violet-500/10 border-violet-500/30 text-violet-500 font-semibold"
                  : "bg-transparent border-transparent text-slate-500 dark:text-slate-400 font-normal hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={on ? 2 : 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={n.icon} />
            </svg>
            {n.label}
          </button>
        );
      })}
    </div>
  );
}
