import type { Theme } from "../../theme";

// components/form/EyeToggle.tsx
interface EyeToggleProps {
  show: boolean;
  onToggle: () => void;
  T: Theme;
}

export function EyeToggle({ show, onToggle, T }: EyeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: "absolute",
        right: 12,
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: T.textLo,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = T.violet)}
      onMouseLeave={(e) => (e.currentTarget.style.color = T.textLo)}
    >
      {show ? (
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
          <circle cx={12} cy={12} r={3} />
        </svg>
      ) : (
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx={12} cy={12} r={3} />
        </svg>
      )}
    </button>
  );
}
