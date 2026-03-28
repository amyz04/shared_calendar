import { BrandHeader } from "./BrandHeader";
import { AuthCard } from "./AuthCard";
import { ThemeToggle } from "../ui/ThemeToggle";

interface LoginPageProps {
  isDark: boolean;
  toggleTheme: () => void;
  onAuth: (mode: "user" | "guest") => void;
}

export function LoginPage({ isDark, toggleTheme, onAuth }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-6 relative">
      <div className="absolute top-5 right-5">
        <ThemeToggle isDark={isDark} toggle={toggleTheme} />
      </div>
      <BrandHeader />
      <AuthCard onAuth={onAuth} />
    </div>
  );
}
