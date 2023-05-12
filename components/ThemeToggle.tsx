"use client";

import * as React from "react";
import { useState } from "react";

export const LOCAL_STORAGE_KEY = "theme";

export const THEME_OPTIONS = { dark: "dark", light: "light" } as const;

export default function ThemeToggle({
  theme,
  onSaveSettings,
}: {
  theme?: keyof typeof THEME_OPTIONS;
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

  return (
    <form
      action={async () => {
        let newTheme;

        if (currentTheme === undefined) {
          newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? THEME_OPTIONS.dark
            : THEME_OPTIONS.light;
        } else {
          // Toggle theme
          newTheme =
            currentTheme === THEME_OPTIONS.dark
              ? THEME_OPTIONS.light
              : THEME_OPTIONS.dark;
        }

        updateCurrentTheme(newTheme);

        await onSaveSettings({
          theme: newTheme,
        });
      }}
    >
      <button
        ref={(node) => {
          // For consecutive page loads make sure we store the preferred choice in a cookie

          if (currentTheme === undefined) {
            node?.click();
          }
        }}
        type="submit"
        className="absolute right-2 top-2 rounded-md border-2 px-4 py-2 hover:border-sky-300 active:border-sky-500 dark:border-gray-200 dark:hover:border-sky-300 dark:active:border-sky-500"
      >
        {currentTheme === "dark" ? "☀️" : "🌛"}
      </button>
    </form>
  );
}
