import { useState } from "react";
import { FormField } from "../form/FormField";
import { PasswordInput } from "../form/PasswordInput";
import { DateOfBirthInput } from "../form/DateOfBirthInput";
import { inputCls } from "../ui/inputStyle";
import type { RegisterData } from "../../types";

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => void;
  loading?: boolean;
  error?: string;
}

export function RegisterForm({ onSubmit, loading, error }: RegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2.5">
        <FormField label="First name">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className={inputCls}
          />
        </FormField>
        <FormField label="Last name">
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className={inputCls}
          />
        </FormField>
      </div>

      <DateOfBirthInput value={dateOfBirth} onChange={setDateOfBirth} />

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

      {error && <p className="text-xs text-red-400 font-syne">{error}</p>}

      <button
        onClick={() =>
          onSubmit({ firstName, lastName, email, password, dateOfBirth })
        }
        disabled={loading}
        className="w-full py-2.5 mt-1 rounded-lg bg-violet-500 hover:bg-violet-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-semibold font-syne border-none cursor-pointer transition-all"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </div>
  );
}
