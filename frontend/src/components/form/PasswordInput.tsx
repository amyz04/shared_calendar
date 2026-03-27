import type { Theme } from "../../theme";
import { EyeToggle } from "./EyeToggle";
import { useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  T: Theme;
  inputStyle: React.CSSProperties;
}

export function PasswordInput({
  value,
  onChange,
  T,
  inputStyle,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        onChange={onChange}
        type={show ? "text" : "password"}
        placeholder="Password"
        style={{ ...inputStyle, paddingRight: 42 }}
      />
      <EyeToggle show={show} onToggle={() => setShow((p) => !p)} T={T} />
    </div>
  );
}
