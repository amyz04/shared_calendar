import type { Theme } from "../../theme";

export type AuthMode = "login" | "register";

interface ModeToggleProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
  T: Theme;
}
// allows us to switch tabs between logging in and registering
export function ModeToggle({ mode, onChange, T }: ModeToggleProps) {
  return (
    <div
      style={{
        display: "flex",
        background: T.surface,
        borderRadius: 10,
        padding: 3,
        marginBottom: 24,
        border: `1px solid ${T.border}`,
      }}
    >
      {(["login", "register"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 8,
            border: "none",
            background: mode === m ? T.violet : "transparent",
            color: mode === m ? "#fff" : T.textMd,
            fontSize: 13,
            fontWeight: mode === m ? 600 : 400,
            cursor: "pointer",
            fontFamily: "'Syne',sans-serif",
            transition: "all 0.15s",
            textTransform: "capitalize",
          }}
        >
          {m === "login" ? "Sign in" : "Create account"}
        </button>
      ))}
    </div>
  );
}
