import type { Theme } from "../../theme";
import { FormField } from "./FormField";

interface DOBProps {
  value: string; // ISO date string "YYYY-MM-DD"
  onChange: (val: string) => void;
  T: Theme;
  inputStyle: React.CSSProperties;
}

export function DateOfBirthInput({ value, onChange, T, inputStyle }: DOBProps) {
  return (
    <FormField label="Date of birth" T={T}>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        max={new Date().toISOString().split("T")[0]} // prevents future dates
        style={inputStyle}
      />
    </FormField>
  );
}
