import { useState } from "react";
import type { Theme } from "../../theme";
import { FormField } from "../form/FormField";
import { PasswordInput } from "../form/PasswordInput";
import { DateOfBirthInput } from "../form/DateOfBirthInput";

interface RegisterFormProps {
  T: Theme;
  inputStyle: React.CSSProperties;
  onSubmit: (data: RegisterData) => void;
}

// companion type you'd define alongside it
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string; // "YYYY-MM-DD"
}

export function RegisterForm({ T, inputStyle, onSubmit }: RegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <FormField label="First name" T={T}>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Alex"
            style={inputStyle}
          />
        </FormField>
        <FormField label="Last name" T={T}>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Lee"
            style={inputStyle}
          />
        </FormField>
      </div>

      <DateOfBirthInput
        value={dob}
        onChange={setDob}
        T={T}
        inputStyle={inputStyle}
      />

      <FormField label="Email" T={T}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@email.com"
          style={inputStyle}
        />
      </FormField>

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        T={T}
        inputStyle={inputStyle}
      />

      <button
        onClick={() => onSubmit({ firstName, lastName, email, password, dob })}
        style={
          {
            /* your violet button styles */
          }
        }
      >
        Create account
      </button>
    </div>
  );
}
