export function BrandHeader() {
  return (
    <div className="flex items-center gap-2.5 mb-9">
      <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth={2.2}
          strokeLinecap="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-syne tracking-tight">
        voyage
      </span>
    </div>
  );
}
