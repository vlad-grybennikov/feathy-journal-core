/**
 * Minimal shared design tokens — the values both platforms must agree on for
 * the UIs to look identical. Deliberately small (colors / spacing / radii);
 * type scale and component-level tokens can come later if drift appears.
 *
 * Web consumes these in DOM/Tailwind components, mobile in RN/NativeWind ones.
 * Numbers are px on web and density-independent points on RN — the same
 * numeric values are correct on both.
 */

export const palette = {
  /** Primary action / active accent (Tailwind blue-600 family, the app's idiom). */
  accent: '#2563eb',
  accentSoft: '#eff6ff',

  /** Semantic. */
  success: '#16a34a',
  danger: '#dc2626',
  warning: '#f59e0b',

  /** Neutrals actually used by the components (Tailwind gray scale). */
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  white: '#ffffff',
} as const;

/** Spacing scale (Tailwind's 4-based scale, the steps the app actually uses). */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

/** Corner radii. Cards are rounded-2xl; controls rounded-lg. */
export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  card: 16,
  full: 9999,
} as const;
