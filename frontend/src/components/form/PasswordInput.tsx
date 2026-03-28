import { useState } from "react";
import { EyeToggle } from "./EyeToggle";
import { inputCls } from "../ui/inputStyle";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordInput({ value, onChange }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        value={value}
        onChange={onChange}
        type={show ? "text" : "password"}
        placeholder="Password"
        className={`${inputCls} pr-10`}
      />
      <EyeToggle show={show} onToggle={() => setShow((p) => !p)} />
    </div>
  );
}
