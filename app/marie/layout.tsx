import React, { Suspense } from "react";

import HomePage from "./../../components/HomePage";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <HomePage title="Marienhof Menu" emoji="🧑🏼‍🍳" telNumber="+431408890530" />
      }
    >
      {children}
    </Suspense>
  );
}
