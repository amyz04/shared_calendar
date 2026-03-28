import { FormField } from "./FormField";
import { inputCls } from "../ui/inputStyle";

interface DateOfBirthInputProps {
  value: string;
  onChange: (val: string) => void;
}

export function DateOfBirthInput({ value, onChange }: DateOfBirthInputProps) {
  return (
    <FormField label="Date of birth">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
        min="1900-01-01"
        className={inputCls}
      />
    </FormField>
  );
}
