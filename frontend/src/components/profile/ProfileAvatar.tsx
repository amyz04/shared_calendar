const COLORS = [
  "#8b5cf6",
  "#f87171",
  "#f59e0b",
  "#34d399",
  "#60a5fa",
  "#f472b6",
  "#fb923c",
  "#4ade80",
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
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {email}
          </div>
        </div>
      </div>
      <div className="flex gap-1.5">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            style={{
              backgroundColor: c,
              borderColor: avatarColor === c ? "#0f172a" : "transparent",
            }}
            className="w-5 h-5 rounded-full border-2 cursor-pointer transition-all"
          />
        ))}
      </div>
    </div>
  );
}
