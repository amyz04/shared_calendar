interface LockedButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function LockedButton({ children, className = "" }: LockedButtonProps) {
  return (
    <div
      title="Sign in to use this feature"
      className={`opacity-40 cursor-not-allowed inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-[13px] font-semibold text-slate-400 dark:text-slate-500 font-syne select-none ${className}`}
    >
      <svg
        width={12}
        height={12}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <rect x={3} y={11} width={18} height={11} rx={2} />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
      {children}
    </div>
  );
}
