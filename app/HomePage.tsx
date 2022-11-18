"use client";

import type { NextPage } from "next";
import Head from "next/head";

import { repository } from "./../package.json";

const weekdayStrings = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
];

const cleanser: [RegExp, string][] = [
  [/(\S)mit /, "$1 mit "],
  [/ mit(\S)/, " mit $1"],
  [/(\S)& /, "$1 & "],
];

const replace = (name: string) => {
  let cleansed = name;

  for (const clean of cleanser) {
    const [pattern, substitute] = clean;
    cleansed = cleansed.replace(pattern, substitute);
  }

  return cleansed;
};

const Home: NextPage<{
  days: string[][][];
  weekDateRange: string;
  timestamp: string;
}> = ({ days, weekDateRange, timestamp }) => {
  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Marienhof Menu</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <h1 className="text-3xl text-center">🧑🏼‍🍳 Marienhof Menu 🧑🏼‍🍳</h1>

      <div className="md:w-3/4 mx-auto my-8">
        <div className="flex justify-between items-center">
          <h2>Menü für {weekDateRange}</h2>
          <a
            href="tel:+431408890530"
            className="semi-bold p-2 border border-sky-100 rounded-md hover:border-sky-300 active:bg-slate-200"
          >
            ☎️ Call
          </a>
        </div>
        {days.map((day, dayIndex) => (
          <div key={dayIndex}>
            <h2 className="text-2xl pt-2">{weekdayStrings[dayIndex]}</h2>
            {day.map(([name, price], menuIndex) => (
              <div key={menuIndex} className="flex justify-between">
                <div>{replace(name)}</div>
                <div className="ml-2 flex-none text-right">€ {price}</div>
              </div>
            ))}
          </div>
        ))}

        <div className="flex-1 text-gray-400 pt-4 text-xs">
          Last generated: {timestamp}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 text-center p-2 bg-gray-100">
        Developed with ❤️ in Vienna -
        <a
          className="underline decoration-sky-500 semi-bold hover:text-sky-500 pl-1"
          href={repository}
          rel="noreferrer"
          target="_blank"
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default Home;
