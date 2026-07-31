export type ColorPreset = {
  id: string;
  label: string;
  swatch: string; // representative color for the picker UI
};

export const COLOR_PRESETS: ColorPreset[] = [
  { id: "neutral", label: "Neutral", swatch: "oklch(0.205 0 0)" },
  { id: "blue", label: "Blue", swatch: "oklch(0.546 0.215 262.9)" },
  { id: "green", label: "Green", swatch: "oklch(0.545 0.15 152.5)" },
  { id: "rose", label: "Rose", swatch: "oklch(0.575 0.215 15.5)" },
  { id: "orange", label: "Orange", swatch: "oklch(0.65 0.19 55)" },
  { id: "violet", label: "Violet", swatch: "oklch(0.55 0.25 292.5)" },
];

export const DEFAULT_COLOR_PRESET = "neutral";

export type LayoutDensity = "comfortable" | "compact";
export type NavPosition = "sidebar" | "top";

export const DEFAULT_DENSITY: LayoutDensity = "comfortable";
export const DEFAULT_NAV_POSITION: NavPosition = "sidebar";
