import { useState } from "react";
import type { Theme } from "../theme";
import { ThemeToggle } from "./ui";

interface LoginPageProps {
  T: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  onAuth: (mode: "user" | "guest") => void;
}

export function LoginPage({ T, isDark, toggleTheme, onAuth }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const is = { width: "100%", padding: "10px 14px", borderRadius: 9, fontSize: 13, background: T.surface, border: `1px solid ${T.border}`, color: T.text, outline: "none", fontFamily: "'Syne',sans-serif" } as const;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>

      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <ThemeToggle isDark={isDark} toggle={toggleTheme} T={T} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: T.violetSoft, border: `1px solid ${T.violet}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={T.violet} strokeWidth={2.2} strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span style={{ fontSize: 24, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>voyage</span>
      </div>

      <div style={{ width: "100%", maxWidth: 400, background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>

        <div style={{ display: "flex", background: T.surface, borderRadius: 10, padding: 3, marginBottom: 24, border: `1px solid ${T.border}` }}>
          {(["login", "register"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: mode === m ? T.violet : "transparent", color: mode === m ? "#fff" : T.textMd, fontSize: 13, fontWeight: mode === m ? 600 : 400, cursor: "pointer", fontFamily: "'Syne',sans-serif", transition: "all 0.15s", textTransform: "capitalize" }}>
              {m === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "register" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: T.textMd, marginBottom: 5, fontFamily: "'Syne',sans-serif" }}>First name</div>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Alex" style={is} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.textMd, marginBottom: 5, fontFamily: "'Syne',sans-serif" }}>Last name</div>
                <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Lee" style={is} />
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: 11, color: T.textMd, marginBottom: 5, fontFamily: "'Syne',sans-serif" }}>Email</div>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email" style={is} />
          </div>

          {/* Password with eye toggle */}
          <div>
            <div style={{ fontSize: 11, color: T.textMd, marginBottom: 5, fontFamily: "'Syne',sans-serif" }}>Password</div>
            <div style={{ position: "relative" }}>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                style={{ ...is, paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.textLo, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = T.violet)}
                onMouseLeave={e => (e.currentTarget.style.color = T.textLo)}>
                {showPassword ? (
                  /* Eye-off icon */
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
                    <circle cx={12} cy={12} r={3} />
                  </svg>
                ) : (
                  /* Eye icon */
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx={12} cy={12} r={3} />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button onClick={() => onAuth("user")} style={{ width: "100%", padding: "11px", borderRadius: 9, background: T.violet, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne',sans-serif", marginTop: 4 }}>
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span style={{ fontSize: 12, color: T.textLo, fontFamily: "'Syne',sans-serif" }}>or</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>

        <button
          onClick={() => onAuth("guest")}
          style={{ width: "100%", padding: "11px", borderRadius: 9, background: "transparent", border: `1px solid ${T.border}`, color: T.textMd, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Syne',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.violet; (e.currentTarget as HTMLButtonElement).style.color = T.violet; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.border; (e.currentTarget as HTMLButtonElement).style.color = T.textMd; }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx={12} cy={12} r={3} /></svg>
          Continue as guest
        </button>

        <p style={{ fontSize: 11, color: T.textLo, textAlign: "center", marginTop: 14, lineHeight: 1.6, fontFamily: "'Syne',sans-serif" }}>
          Guest mode lets you explore the app. Some features require an account.
        </p>
      </div>
    </div>
  );
}