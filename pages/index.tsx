import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import pdf from "pdf-parse";

import { repository } from "./../package.json";

const weekdayStrings = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
];

const Home: NextPage<{ days: string[][][]; weekDateRange: string }> = ({
  days,
  weekDateRange,
}) => {
  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Marienhof Menu</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <h1 className="text-3xl text-center">🧑🏼‍🍳 Marienhof Menu 🧑🏼‍🍳</h1>

      <div className="md:w-3/4 mx-auto my-8">
        <h2>Menü für {weekDateRange}</h2>
        {days.map((day, dayIndex) => (
          <div key={dayIndex}>
            <h2 className="text-2xl pt-2">{weekdayStrings[dayIndex]}</h2>
            {day.map(([name, price], menuIndex) => (
              <div key={menuIndex} className="flex justify-between">
                <div>{name}</div>
                <div className="ml-2 flex-none text-right">€ {price}</div>
              </div>
            ))}
          </div>
        ))}

        <div className="flex-1 text-gray-400 pt-4 text-xs">
          Last generated: {new Date().toLocaleString("de")}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 text-center p-2 bg-gray-100">
        Developed with ❤️ in Vienna -{" "}
        <a
          className="underline decoration-sky-500 semi-bold hover:text-sky-500"
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

export const getStaticProps: GetStaticProps = async () => {
  const dataBuffer = await fetch(
    "http://www.restaurant-marienhof.at/restaurant/pdf/wochenmenue.pdf"
  );
  const blobContent = await dataBuffer.arrayBuffer();

  const weekdaysMenu = [];

  const data = (await pdf(Buffer.from(blobContent))) as { text: string };

  let weekdayCount = 0;

  let collector = [];
  let startCollecting = false;
  const lines = data.text
    .split("\n")
    .map((str) => str.trim().replace(/  +/g, " "))
    .filter(Boolean);

  let weekDateRange = "";

  for (const line of lines) {
    const weekdaySearch = weekdayStrings[weekdayCount];

    if (line.startsWith("Menüplan")) {
      // Date info
      weekDateRange = line.split("Menüplan")[1].replace(/ /g, "").trim();
    } else if (line.replaceAll(" ", "") === weekdaySearch) {
      if (collector.length > 0) {
        weekdaysMenu.push(collector);
      }

      collector = [];
      startCollecting = true;
      weekdayCount++;
    } else if (line.includes("WOCHENEMPFEHLUNG")) {
      weekdaysMenu.push(collector);
      startCollecting = false;
    } else if (startCollecting) {
      collector.push(line);
    }
  }

  // fix some line breaks

  const fixedDays = weekdaysMenu.map((weekday) => {
    let fixedMenutItems = [];

    if (weekday.length > 3) {
      let concatMenu = [];

      for (const menu of weekday) {
        if (menu.includes("€")) {
          if (concatMenu.length === 0) {
            fixedMenutItems.push(menu);
          } else {
            concatMenu.push(menu);
            fixedMenutItems.push(concatMenu.join(", "));
            concatMenu = [];
          }
        } else {
          concatMenu.push(menu);
        }
      }
    } else {
      fixedMenutItems = weekday;
    }

    // Now split price apart
    return fixedMenutItems.map((item) =>
      item.split("€").map((item) => item.trim())
    );
  });

  return {
    props: { days: fixedDays, weekDateRange },
  };
};

export default Home;
