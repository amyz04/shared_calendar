const COLORS = [
  "#8b5cf6", // violet
  "#2dd4bf", // teal
  "#60a5fa", // blue
  "#34d399", // emerald
  "#f472b6", // pink
  "#fb923c", // orange
  "#facc15", // yellow
  "#a78bfa", // lavender
  "#38bdf8", // sky
  "#4ade80", // green
  "#e879f9", // fuchsia
  "#94a3b8", // slate
];

interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
  email: string;
  avatarColor: string;
  onColorChange: (c: string) => void;
}

export function ProfileAvatar({
  firstName,
  lastName,
  email,
  avatarColor,
  onColorChange,
}: ProfileAvatarProps) {
  return (
    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
      <div className="flex items-center gap-3.5 mb-3.5">
        <div
          style={{
            backgroundColor: `${avatarColor}20`,
            borderColor: `${avatarColor}50`,
            color: avatarColor,
          }}
          className="w-13 h-13 rounded-full border-2 flex items-center justify-center text-lg font-bold font-syne relative shrink-0"
        >
          {firstName[0]}
          {lastName[0]}
          <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white dark:border-slate-900" />
        </div>
        <div>
          <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100 font-syne">
            {firstName} {lastName}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{email}</div>
        </div>
      </div>

      {/* Color picker */}
      <div className="flex flex-wrap gap-1.5">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            style={{ backgroundColor: c }}
            className={`w-5 h-5 rounded-full cursor-pointer transition-all border-2 ${
              avatarColor === c
                ? "border-white dark:border-slate-100 scale-110 shadow-md"
                : "border-transparent hover:scale-110"
            }`}
          />
        ))}
      </div>
    </div>
  );
}