interface PillProps {
  children: React.ReactNode;
  color: string;
  dot?: boolean;
}

export function Pill({ children, color, dot = false }: PillProps) {
  return (
    <span
      style={{
        backgroundColor: `${color}18`,
        borderColor: `${color}35`,
        color,
      }}
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-syne whitespace-nowrap border"
    >
      {dot && (
        <span
          style={{ backgroundColor: color }}
          className="w-1.5 h-1.5 rounded-full inline-block"
        />
      )}
      {children}
    </span>
  );
}
