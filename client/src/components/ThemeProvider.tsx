"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import {
  type ThemeId,
  type ThemeDefinition,
  themes,
  getThemeById,
} from "@/lib/themes";

interface DesignSystemContextValue {
  designTheme: ThemeId;
  setDesignTheme: (id: ThemeId) => void;
  themeDef: ThemeDefinition;
  isDark: boolean;
}

const DesignSystemContext = createContext<DesignSystemContextValue | null>(null);

const STORAGE_KEY = "design-theme";

function DesignSystemProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [designTheme, setDesignThemeState] = useState<ThemeId>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (stored && themes.find((t) => t.id === stored)) {
      setDesignThemeState(stored);
    }
    setMounted(true);
  }, []);

  const setDesignTheme = useCallback((id: ThemeId) => {
    setDesignThemeState(id);
    localStorage.setItem(STORAGE_KEY, id);

    const themeDef = getThemeById(id);
    document.documentElement.setAttribute("data-theme", id);

    // Sync next-themes dark class for compatibility
    if (themeDef.dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Apply theme on mount and when designTheme changes
  useEffect(() => {
    if (!mounted) return;

    const themeDef = getThemeById(designTheme);
    document.documentElement.setAttribute("data-theme", designTheme);

    if (themeDef.dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [designTheme, mounted]);

  // Sync with OS system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Only auto-switch if user hasn't manually chosen
        const prefersDark = e.matches;
        const targetTheme = prefersDark ? "dark" : "light";
        setDesignTheme(targetTheme);
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [mounted, setDesignTheme]);

  const themeDef = useMemo(() => getThemeById(designTheme), [designTheme]);

  const value = useMemo(
    () => ({
      designTheme,
      setDesignTheme,
      themeDef,
      isDark: themeDef.dark,
    }),
    [designTheme, setDesignTheme, themeDef]
  );

  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystem() {
  const ctx = useContext(DesignSystemContext);
  if (!ctx) throw new Error("useDesignSystem must be used within DesignSystemProvider");
  return ctx;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <DesignSystemProvider>{children}</DesignSystemProvider>
    </NextThemesProvider>
  );
}
