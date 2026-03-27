import { useState } from "react";
import { FormField } from "../form/FormField";
import { PasswordInput } from "../form/PasswordInput";
import type { Theme } from "../../theme";

interface LoginData {
  email: string;
  password: string;
}

interface LoginFormProps {
  T: Theme;
  inputStyle: React.CSSProperties;
  onSubmit: (data: LoginData) => void;
}

export function LoginForm({ T, inputStyle, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <FormField label="Email" T={T}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          type="email"
          style={inputStyle}
        />
      </FormField>

      <FormField label="Password" T={T}>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          T={T}
          inputStyle={inputStyle}
        />
      </FormField>

      <button
        onClick={() => onSubmit({ email, password })}
        style={{
          width: "100%",
          padding: "11px",
          borderRadius: 9,
          background: T.violet,
          border: "none",
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'Syne',sans-serif",
          marginTop: 4,
        }}
      >
        Sign in
      </button>
    </div>
  );
}
