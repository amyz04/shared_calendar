import type React from "react";
import type { Theme } from "../../theme";

interface FormFieldProps {
  label: string;
  T: Theme;
  children: React.ReactNode;
}

export function FormField({ label, T, children }: FormFieldProps) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: T.textMd,
          marginBottom: 5,
          fontFamily: "'Syne',sans-serif",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
