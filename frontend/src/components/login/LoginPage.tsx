import { BrandHeader } from "./BrandHeader";
import { AuthCard } from "./AuthCard";
import { ThemeToggle } from "./../UI";
import type { Theme } from "../../theme";

interface LoginPageProps {
  T: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  onAuth: (mode: "user" | "guest") => void;
}

export function LoginPage({ T, isDark, toggleTheme, onAuth }: LoginPageProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <ThemeToggle isDark={isDark} toggle={toggleTheme} T={T} />
      </div>

      <BrandHeader T={T} />
      <AuthCard T={T} onAuth={onAuth} />
    </div>
  );
}
