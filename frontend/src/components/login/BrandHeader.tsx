import type { Theme } from "../../theme";

// the logo and application name
export function BrandHeader({ T }: { T: Theme }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 36,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          background: T.violetSoft,
          border: `1px solid ${T.violet}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke={T.violet}
          strokeWidth={2.2}
          strokeLinecap="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <span
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: T.text,
          fontFamily: "'Syne',sans-serif",
          letterSpacing: "-0.03em",
        }}
      >
        voyage
      </span>
    </div>
  );
}
