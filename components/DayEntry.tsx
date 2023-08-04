"use client";

import React from "react";

const Home = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => {
  const currentWeekDay = new Date().getUTCDay();

  const isHighlighted = currentWeekDay === index;

  const ref = React.useRef(null);

  return (
    <div
      ref={(node) => {
        if (node && isHighlighted) {
          node.scrollIntoView({ behavior: "smooth" });
        }
      }}
      className={`rounded-md border-2 p-3 odd:bg-slate-100 dark:odd:bg-slate-500 ${
        isHighlighted
          ? "border-orange-500"
          : "border-white dark:border-slate-800"
      }`}
    >
      {children}
    </div>
  );
};

export default Home;
