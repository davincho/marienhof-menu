"use client";

import * as React from "react";

import { useDarkMode } from "usehooks-ts";

export const LOCAL_STORAGE_KEY = "theme";

export const THEME_OPTIONS = { dark: "dark", light: "light" } as const;

export default function ThemeToggle({
  onSaveSettings,
}: {
  theme?: keyof typeof THEME_OPTIONS;
  onSaveSettings: any;
}) {
  const { isDarkMode, toggle } = useDarkMode();

  const [isMoutned, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMoutned) {
    return;
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        toggle();

        var htmlElement = document.querySelector("html");

        if (htmlElement) {
          if (isDarkMode) {
            htmlElement.classList.remove("dark");
          } else {
            htmlElement.classList.add("dark");
          }
        }

        onSaveSettings({
          theme: "",
        });
      }}
    >
      <button
        type="submit"
        className="absolute right-2 top-2 rounded-md border-2 px-4 py-2 hover:border-sky-300 active:border-sky-500 dark:border-gray-200 dark:hover:border-sky-300 dark:active:border-sky-500"
      >
        {isDarkMode ? "☀️" : "🌛"}
      </button>
    </form>
  );
}
