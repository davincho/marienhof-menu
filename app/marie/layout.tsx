import React, { Suspense } from "react";

import Shell from "./../../components/Shell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Shell title="🧑🏼‍🍳 Marienhof Menu 🧑🏼‍🍳" />}>
      {children}
    </Suspense>
  );
}
