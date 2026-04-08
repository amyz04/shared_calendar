import { useState } from "react";
import { ModeToggle, type AuthMode } from "./ModeToggle";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { GuestButton } from "./GuestButton";
import { loginApi, registerApi, saveToken, saveUser } from "../../api/auth";
import type { RegisterData } from "../../types";
import { useAuth } from "../../context/AuthContext";

interface AuthCardProps {
  onAuth: (mode: "user" | "guest") => void;
}

export function AuthCard({ onAuth }: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  async function handleLogin(data: { email: string; password: string }) {
    try {
      setLoading(true);
      setError("");
      const res = await loginApi(data.email, data.password);
      login(res.token, res.user);
      onAuth("user");
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(data: RegisterData) {
    try {
      setLoading(true);
      setError("");
      const res = await registerApi({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        dateOfBirth: data.dateOfBirth,
      });
      login(res.token, res.user);
      onAuth("user");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7">
      <ModeToggle
        mode={mode}
        onChange={(m) => {
          setMode(m);
          setError("");
        }}
      />

      {error && mode === "login" && (
        <p className="text-xs text-red-400 text-center mb-3 font-syne">
          {error}
        </p>
      )}

      <div key={mode} className="animate-fade-slide">
        {mode === "login" ? (
          <LoginForm onSubmit={handleLogin} loading={loading} />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            error={mode === "register" ? error : ""}
          />
        )}
      </div>

      <GuestButton onGuest={() => onAuth("guest")} />
    </div>
  );
}
