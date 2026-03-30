import type { Friend } from "../../types";

interface AvatarProps {
  f: Friend;
  size?: number;
}

export function Avatar({ f, size = 32 }: AvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        fontSize: size * 0.31,
        backgroundColor: `${f.color}22`,
        borderColor: `${f.color}55`,
        color: f.color,
      }}
      className="rounded-full border flex items-center justify-center font-bold font-syne shrink-0"
    >
      {f.initials}
    </div>
  );
}
