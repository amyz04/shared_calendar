import { useState } from "react";
import { ModeToggle, type AuthMode } from "./ModeToggle";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { GuestButton } from "./GuestButton";

interface AuthCardProps {
  onAuth: (mode: "user" | "guest") => void;
}

export function AuthCard({ onAuth }: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="w-full max-w-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7">
      <ModeToggle mode={mode} onChange={setMode} />

      <div key={mode} className="animate-fade-slide">
        {mode === "login" ? (
          <LoginForm onSubmit={() => onAuth("user")} />
        ) : (
          <RegisterForm onSubmit={() => onAuth("user")} />
        )}
      </div>

      <GuestButton onGuest={() => onAuth("guest")} />
    </div>
  );
}
