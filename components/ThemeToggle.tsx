"use client";

import * as React from "react";
import { useState } from "react";

export const LOCAL_STORAGE_KEY = "theme";

export const THEME_OPTIONS = { dark: "dark", light: "light" } as const;

export default function ThemeToggle({
  theme,
  onSaveSettings,
}: {
  theme: keyof typeof THEME_OPTIONS;
  onSaveSettings: any;
}) {
  // For now we have to use useState instead of useOptimistic
  const [currentTheme, updateCurrentTheme] = useState(theme);

  React.useLayoutEffect(() => {
    if (
      currentTheme === "dark" ||
      (currentTheme === undefined &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [currentTheme]);

  React.useEffect(() => {
    if (currentTheme === undefined) {
      const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? THEME_OPTIONS.dark
        : THEME_OPTIONS.light;

      updateCurrentTheme(theme);

      onSaveSettings({
        theme,
      });
    }
  }, [currentTheme, onSaveSettings]);

  return (
    <form
      action={async () => {
        const newTheme =
          currentTheme === THEME_OPTIONS.dark
            ? THEME_OPTIONS.light
            : THEME_OPTIONS.dark;

        updateCurrentTheme(newTheme);

        await onSaveSettings({
          theme: newTheme,
        });
      }}
    >
      <button
        type="submit"
        className="fixed top-2 right-2 py-2 px-4 dark:border-gray-200 border-2 rounded-md"
      >
        {currentTheme === "dark" ? "☀️" : "🌛"}
      </button>
    </form>
  );
}
