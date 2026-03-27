import { useState } from "react";
import { ModeToggle, type AuthMode } from "./ModeToggle";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { GuestButton } from "./GuestButton";
import type { Theme } from "../../theme";

interface AuthCardProps {
  T: Theme;
  onAuth: (mode: "user" | "guest") => void;
}

//card shell which renders the correct form based on the mode
export function AuthCard({ T, onAuth }: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>("login");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 9,
    fontSize: 13,
    background: T.surface,
    border: `1px solid ${T.border}`,
    color: T.text,
    outline: "none",
    fontFamily: "'Syne',sans-serif",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 400,
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: 28,
      }}
    >
      <ModeToggle mode={mode} onChange={setMode} T={T} />

      {mode === "login" ? (
        <LoginForm
          T={T}
          inputStyle={inputStyle}
          onSubmit={() => onAuth("user")}
        />
      ) : (
        <RegisterForm
          T={T}
          inputStyle={inputStyle}
          onSubmit={() => onAuth("user")}
        />
      )}

      <GuestButton onGuest={() => onAuth("guest")} T={T} />
    </div>
  );
}
