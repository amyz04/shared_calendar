import type { Theme } from "../../theme";

interface GuestButtonProps {
  onGuest: () => void;
  T: Theme;
}
// divider and guest CTA
export function GuestButton({ onGuest, T }: GuestButtonProps) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "20px 0",
        }}
      >
        <div style={{ flex: 1, height: 1, background: T.border }} />
        <span
          style={{
            fontSize: 12,
            color: T.textLo,
            fontFamily: "'Syne',sans-serif",
          }}
        >
          or
        </span>
        <div style={{ flex: 1, height: 1, background: T.border }} />
      </div>

      <button
        onClick={onGuest}
        style={{
          width: "100%",
          padding: "11px",
          borderRadius: 9,
          background: "transparent",
          border: `1px solid ${T.border}`,
          color: T.textMd,
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "'Syne',sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = T.violet;
          e.currentTarget.style.color = T.violet;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = T.border;
          e.currentTarget.style.color = T.textMd;
        }}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx={12} cy={12} r={3} />
        </svg>
        Continue as guest
      </button>

      <p
        style={{
          fontSize: 11,
          color: T.textLo,
          textAlign: "center",
          marginTop: 14,
          lineHeight: 1.6,
          fontFamily: "'Syne',sans-serif",
        }}
      >
        Guest mode lets you explore the app. Some features require an account.
      </p>
    </>
  );
}
