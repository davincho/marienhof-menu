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
  return (
    <Shell title={`${emoji} ${title} ${emoji}`}>
      <div className="flex justify-between items-center">
        <h2>Menü für {weekDateRange}</h2>
        {telNumber ? (
          <a
            href={`tel:${telNumber}`}
            className="semi-bold p-2 border border-sky-100 rounded-md hover:border-sky-300 active:border-sky-500"
          >
            ☎️ Call
          </a>
        ) : undefined}
      </div>
      {days.map((day, dayIndex) => (
        <div key={dayIndex}>
          <h2 className="text-2xl pt-2 font-heading">
            {weekdayStrings[dayIndex]}
          </h2>
          {day.map((menu, menuIndex) => (
            <div key={menuIndex} className="flex justify-between">
              {menuRenderer(menu)}
            </div>
          ))}
        </div>
      ))}

      {timestamp && (
        <div className="flex-1 text-gray-400 pt-4 text-xs">
          Last generated: {timestamp}
        </div>
      )}
    </Shell>
  );
};

export default Home;
