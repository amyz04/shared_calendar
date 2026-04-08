import { getUser } from "../../api/auth";

interface SidebarFooterProps {
  isGuest: boolean;
  onOpenProfile: () => void;
  onSignIn: () => void;
  onLogout: () => void;
}

export function SidebarFooter({
  isGuest,
  onOpenProfile,
  onSignIn,
  onLogout,
}: SidebarFooterProps) {
  const user = getUser();
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
    : "?";
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Unknown";
  const avatarColor = user?.avatarColor ?? "#8b5cf6";

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 p-2.5">
      {isGuest ? (
        <div className="flex flex-col gap-1.5 px-2.5 py-1.5">
          <div className="text-[11px] text-slate-400 dark:text-slate-600 font-syne flex items-center gap-1.5">
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx={12} cy={12} r={3} />
            </svg>
            Browsing as guest
          </div>
          <button
            onClick={onSignIn}
            className="w-full py-1.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold font-syne border-none cursor-pointer transition-all"
          >
            Sign in
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <button
            onClick={onOpenProfile}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-transparent border border-transparent cursor-pointer text-left transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className="relative shrink-0">
              <div
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: `${avatarColor}22`,
                  border: `1.5px solid ${avatarColor}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: avatarColor,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {initials}
              </div>
              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-400 border-2 border-white dark:border-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-syne">{displayName}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-600">View profile →</div>
            </div>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-transparent border border-transparent cursor-pointer text-left transition-all hover:bg-red-400/10 hover:border-red-400/20 group"
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="text-slate-400 group-hover:text-red-400 transition-colors">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className="text-[11px] text-slate-400 group-hover:text-red-400 font-syne transition-colors">Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}