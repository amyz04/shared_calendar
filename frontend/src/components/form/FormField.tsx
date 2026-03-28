import type React from "react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}
export function FormField({ label, children }: FormFieldProps) {
  return (
    <div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">
        {label}
      </div>
      {children}
    </div>
  );
}
