// Centralized design system tokens for consistent UI across the app.
// Use these constants in components instead of hard-coded values.

// Color palette based roughly on Tailwind defaults (blue, purple, indigo, green, amber, red, gray)
export const colors = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  secondary: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a855f7",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
  },
  accent: {
    // Use these for gradients like: bg-gradient-to-r from-[accent.500] to-[accent.700]
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },
  success: {
    50: "#ecfdf3",
    100: "#d1fadf",
    200: "#a6f4c5",
    300: "#6ce9a6",
    400: "#32d583",
    500: "#12b76a",
    600: "#039855",
    700: "#027a48",
    800: "#05603a",
    900: "#054f31",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2933",
    900: "#111827",
  },
} as const;

export type ColorPalette = typeof colors;

// Typography scale
export const typography = {
  heading1: {
    fontSize: "1.875rem", // text-3xl
    lineHeight: "2.25rem",
    fontWeight: 700, // bold
  },
  heading2: {
    fontSize: "1.5rem", // text-2xl
    lineHeight: "2rem",
    fontWeight: 600, // semibold
  },
  heading3: {
    fontSize: "1.25rem", // text-xl
    lineHeight: "1.75rem",
    fontWeight: 600, // semibold
  },
  body: {
    fontSize: "1rem", // text-base
    lineHeight: "1.5rem",
    fontWeight: 400,
  },
  small: {
    fontSize: "0.875rem", // text-sm
    lineHeight: "1.25rem",
    fontWeight: 400,
  },
  caption: {
    fontSize: "0.75rem", // text-xs
    lineHeight: "1rem",
    fontWeight: 400,
  },
} as const;

export type TypographyScale = typeof typography;

// Spacing scale based on 4px unit. Access via spacing(n) or spacingScale.
export const spacingUnit = 4; // 4px base unit

export const spacingScale = {
  0: 0,
  1: spacingUnit * 1, // 4px
  2: spacingUnit * 2, // 8px
  3: spacingUnit * 3, // 12px
  4: spacingUnit * 4, // 16px
  5: spacingUnit * 5, // 20px
  6: spacingUnit * 6, // 24px
  8: spacingUnit * 8, // 32px
  10: spacingUnit * 10, // 40px
  12: spacingUnit * 12, // 48px
  16: spacingUnit * 16, // 64px
  20: spacingUnit * 20, // 80px
  24: spacingUnit * 24, // 96px
} as const;

export type SpacingScale = typeof spacingScale;

export const spacing = (multiplier: number): string =>
  `${multiplier * spacingUnit}px`;

// Shadow presets
export const shadows = {
  soft: "0 4px 12px rgba(15, 23, 42, 0.06)", // subtle shadow
  medium: "0 10px 25px rgba(15, 23, 42, 0.12)", // card shadow
  large: "0 20px 45px rgba(15, 23, 42, 0.18)", // modal shadow
  glow: `0 0 0 1px rgba(99, 102, 241, 0.3), 0 0 30px rgba(99, 102, 241, 0.45)`, // colored glow
} as const;

export type ShadowPresets = typeof shadows;

// Border radius presets
export const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  full: "9999px",
} as const;

export type RadiusScale = typeof radii;

// Animation presets – these are useful as CSS values or motion variants.
// You can use the names as classNames, inline styles, or map them to framer-motion variants.
export const animations = {
  fadeIn: {
    name: "fadeIn",
    duration: "200ms",
    timingFunction: "ease-out",
  },
  slideUp: {
    name: "slideUp",
    duration: "250ms",
    timingFunction: "ease-out",
  },
  scaleIn: {
    name: "scaleIn",
    duration: "200ms",
    timingFunction: "ease-out",
  },
  bounce: {
    name: "bounce",
    duration: "500ms",
    timingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

export type AnimationPresets = typeof animations;


