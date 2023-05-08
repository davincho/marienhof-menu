"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

export const LOCAL_STORAGE_KEY = "theme";

export const THEME_OPTIONS = { dark: "dark", light: "light" } as const;

export default function ThemeToggle({
  theme,
  onSaveSettings,
}: {
  theme: keyof typeof THEME_OPTIONS;
  onSaveSettings: any;
}) {
  const router = useRouter();

  React.useLayoutEffect(() => {
    if (
      theme === "dark" ||
      (theme === undefined &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <form
      action={async () => {
        await onSaveSettings();
        router.refresh();
      }}
    >
      <button
        type="submit"
        className="fixed top-2 right-2 py-2 px-4 dark:border-gray-200 border-2 rounded-md"
      >
        {theme === "dark" ? "☀️" : "🌛"}
      </button>
    </form>
  );
}
