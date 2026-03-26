import type { Friend } from "../types";
import type { Theme } from "../theme";

interface AvatarProps {
  f: Friend;
  size?: number;
  T: Theme;
}

export function Avatar({ f, size = 32, T }: AvatarProps) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${f.color}${T.isDark ? "22" : "18"}`, border: `1.5px solid ${f.color}${T.isDark ? "55" : "70"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.31, fontWeight: 700, color: f.color, fontFamily: "'Syne',sans-serif", flexShrink: 0 }}>
      {f.initials}
    </div>
  );
}

interface PillProps {
  children: React.ReactNode;
  color: string;
  T: Theme;
  dot?: boolean;
}

export function Pill({ children, color, T, dot = false }: PillProps) {
  return (
    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: `${color}${T.isDark ? "18" : "12"}`, border: `1px solid ${color}${T.isDark ? "35" : "30"}`, color, fontWeight: 600, fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 5 }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block" }} />}
      {children}
    </span>
  );
}

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
  T: Theme;
}

export function ThemeToggle({ isDark, toggle, T }: ThemeToggleProps) {
  return (
    <button onClick={toggle} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.textMd, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {isDark
        ? <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><circle cx={12} cy={12} r={5} /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
        : <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
      }
    </button>
  );
}
