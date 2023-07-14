import React from "react";

import type { NextPage } from "next";

import Shell from "./Shell";

const weekdayStrings = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
];

const Home: NextPage<{
  days?: string[][][];
  weekDateRange: string;
  timestamp?: string;
  title: string;
  emoji: string;
  telNumber?: string;
  menuRenderer: (menu: string[]) => React.ReactElement;
}> = ({
  days = [],
  weekDateRange,
  timestamp,
  title,
  emoji,
  telNumber,
  menuRenderer,
}) => {
  const currentWeekDay = new Date().getUTCDay();

  return (
    <Shell title={`${emoji} ${title} ${emoji}`}>
      <div className="mb-2 flex items-center justify-between">
        <h2>Menü für {weekDateRange}</h2>
        {telNumber ? (
          <a
            href={`tel:${telNumber}`}
            className="semi-bold rounded-md border border-sky-100 p-2 hover:border-sky-300 active:border-sky-500"
          >
            ☎️ Call
          </a>
        ) : undefined}
      </div>
      {days.map((day, dayIndex) => (
        <div
          key={dayIndex}
          className={`rounded-md border-2 p-3 odd:bg-slate-100 dark:odd:bg-slate-500 ${
            currentWeekDay === dayIndex + 1
              ? "border-orange-500"
              : "border-white dark:border-slate-800"
          }`}
        >
          <h2 className="font-heading text-2xl">{weekdayStrings[dayIndex]}</h2>
          {day.map((menu, menuIndex) => (
            <div key={menuIndex} className="flex justify-between">
              {menuRenderer(menu)}
            </div>
          ))}
        </div>
      ))}

      {timestamp && (
        <div className="flex-1 pt-4 text-xs text-gray-400">
          Last generated: {timestamp}
        </div>
      )}
    </Shell>
  );
};

export default Home;
