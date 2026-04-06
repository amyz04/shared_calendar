import { useState } from "react";
import { FormField } from "../form/FormField";
import { PasswordInput } from "../form/PasswordInput";
import { inputCls } from "../ui/inputStyle";

interface LoginData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginData) => void;
  loading?: boolean;
}

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <FormField label="Email">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          type="email"
          className={inputCls}
        />
      </FormField>

      <FormField label="Password">
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>

      <button
        onClick={() => onSubmit({ email, password })}
        disabled={loading}
        className="w-full py-2.5 mt-1 rounded-lg bg-violet-500 hover:bg-violet-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-semibold font-syne border-none cursor-pointer transition-all"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </div>
  );
}
