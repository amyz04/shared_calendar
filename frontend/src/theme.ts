export const DARK = {
  bg: "#080b12", bgAlt: "#0c1018", surface: "#0f1520", surfaceHi: "#141c2a",
  card: "#111827", border: "#1e2d45", borderHi: "#2a3f5f",
  violet: "#8b5cf6", violetLo: "#7c3aed", violetSoft: "#2d1b69",
  teal: "#14b8a6", amber: "#f59e0b", coral: "#f87171", green: "#10b981",
  text: "#f1f5f9", textMd: "#94a3b8", textLo: "#475569", textHint: "#1e2d45",
  scrollbar: "#2d1b69", isDark: true,
};

export const LIGHT = {
  bg: "#f8f9fc", bgAlt: "#f1f4f9", surface: "#ffffff", surfaceHi: "#f8f9fc",
  card: "#ffffff", border: "#e2e8f0", borderHi: "#cbd5e1",
  violet: "#7c3aed", violetLo: "#6d28d9", violetSoft: "#ede9fe",
  teal: "#0d9488", amber: "#d97706", coral: "#ef4444", green: "#059669",
  text: "#0f172a", textMd: "#475569", textLo: "#94a3b8", textHint: "#e2e8f0",
  scrollbar: "#e2e8f0", isDark: false,
};

export type Theme = typeof DARK;