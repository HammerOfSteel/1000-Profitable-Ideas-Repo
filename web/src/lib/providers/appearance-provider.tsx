"use client";

import * as React from "react";
import {
  COLOR_PRESETS,
  DEFAULT_COLOR_PRESET,
  DEFAULT_DENSITY,
  DEFAULT_NAV_POSITION,
  type LayoutDensity,
  type NavPosition,
} from "@/lib/theme-presets";

type AppearanceContextValue = {
  colorPreset: string;
  setColorPreset: (id: string) => void;
  density: LayoutDensity;
  setDensity: (d: LayoutDensity) => void;
  navPosition: NavPosition;
  setNavPosition: (n: NavPosition) => void;
};

const AppearanceContext = React.createContext<AppearanceContextValue | null>(
  null,
);

const STORAGE_KEY = "app-appearance-settings-v1";

type StoredAppearance = {
  colorPreset: string;
  density: LayoutDensity;
  navPosition: NavPosition;
};

function readStoredAppearance(): StoredAppearance {
  if (typeof window === "undefined") {
    return {
      colorPreset: DEFAULT_COLOR_PRESET,
      density: DEFAULT_DENSITY,
      navPosition: DEFAULT_NAV_POSITION,
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("no stored appearance");
    const parsed = JSON.parse(raw) as Partial<StoredAppearance>;
    return {
      colorPreset:
        COLOR_PRESETS.find((p) => p.id === parsed.colorPreset)?.id ??
        DEFAULT_COLOR_PRESET,
      density: parsed.density === "compact" ? "compact" : DEFAULT_DENSITY,
      navPosition:
        parsed.navPosition === "top" ? "top" : DEFAULT_NAV_POSITION,
    };
  } catch {
    return {
      colorPreset: DEFAULT_COLOR_PRESET,
      density: DEFAULT_DENSITY,
      navPosition: DEFAULT_NAV_POSITION,
    };
  }
}

export function AppearanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [colorPreset, setColorPresetState] =
    React.useState<string>(DEFAULT_COLOR_PRESET);
  const [density, setDensityState] =
    React.useState<LayoutDensity>(DEFAULT_DENSITY);
  const [navPosition, setNavPositionState] =
    React.useState<NavPosition>(DEFAULT_NAV_POSITION);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const stored = readStoredAppearance();
    // Reading persisted appearance from localStorage on mount is a one-time
    // SSR-safe hydration step; a lazy useState initializer would run during
    // server render where `window` is unavailable and cause a mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColorPresetState(stored.colorPreset);
    setDensityState(stored.density);
    setNavPositionState(stored.navPosition);
    setHydrated(true);
  }, []);

  const persist = React.useCallback(
    (next: Partial<StoredAppearance>) => {
      const current: StoredAppearance = {
        colorPreset,
        density,
        navPosition,
        ...next,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    },
    [colorPreset, density, navPosition],
  );

  React.useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute("data-theme", colorPreset);
  }, [colorPreset, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute("data-density", density);
  }, [density, hydrated]);

  const setColorPreset = React.useCallback(
    (id: string) => {
      setColorPresetState(id);
      persist({ colorPreset: id });
    },
    [persist],
  );

  const setDensity = React.useCallback(
    (d: LayoutDensity) => {
      setDensityState(d);
      persist({ density: d });
    },
    [persist],
  );

  const setNavPosition = React.useCallback(
    (n: NavPosition) => {
      setNavPositionState(n);
      persist({ navPosition: n });
    },
    [persist],
  );

  const value = React.useMemo(
    () => ({
      colorPreset,
      setColorPreset,
      density,
      setDensity,
      navPosition,
      setNavPosition,
    }),
    [colorPreset, setColorPreset, density, setDensity, navPosition, setNavPosition],
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const ctx = React.useContext(AppearanceContext);
  if (!ctx) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }
  return ctx;
}
