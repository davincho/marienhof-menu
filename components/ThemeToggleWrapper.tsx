import { cookies } from "next/headers";

import ThemeToggle from "./ThemeToggle";

export const LOCAL_STORAGE_KEY = "theme";

export const THEME_OPTIONS = { dark: "dark", light: "light" } as const;

async function saveSettings({ theme }: { theme: string }) {
  "use server";

  // @ts-expect-error current TS error
  cookies().set({
    name: "theme",
    value: theme,
    httpOnly: true,
    path: "/",
  });

  return {
    theme,
  };
}

export default function ThemeToggleWrapper() {
  const cookieStore = cookies();

  const theme =
    (cookieStore.get("theme")?.value as keyof typeof THEME_OPTIONS) ||
    undefined;

  return <ThemeToggle onSaveSettings={saveSettings} theme={theme} />;
}
