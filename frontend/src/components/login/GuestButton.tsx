interface GuestButtonProps {
  onGuest: () => void;
}

export function GuestButton({ onGuest }: GuestButtonProps) {
  return (
    <>
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-[12px] text-slate-400 dark:text-slate-600 font-syne">
          or
        </span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </div>

      <button
        onClick={onGuest}
        className="w-full py-2.5 rounded-lg bg-transparent border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[13px] font-medium font-syne flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:border-violet-500 hover:text-violet-500"
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx={12} cy={12} r={3} />
        </svg>
        Continue as guest
      </button>

      <p className="text-[11px] text-slate-400 dark:text-slate-600 text-center mt-3.5 leading-relaxed font-syne">
        Guest mode lets you explore the app. Some features require an account.
      </p>
    </>
  );
}
