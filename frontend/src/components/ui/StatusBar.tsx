interface StatusBarProps {
  isGuest: boolean;
  loading: boolean;
}

export function StatusBar({ isGuest, loading }: StatusBarProps) {
  return (
    <div className="flex justify-end mb-8 gap-2.5">
      {isGuest && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-[11px] text-amber-400 font-syne">
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx={12} cy={12} r={3} />
          </svg>
          Guest mode
        </div>
      )}
    </div>
  );
}
