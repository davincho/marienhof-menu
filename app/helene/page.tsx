/* eslint-disable no-console */
import { parse } from "node-html-parser";

import HomePage from "../../components/HomePage";
import { marienRenderer } from "../../utils/render";

const weekdayStrings = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
];

const url =
  "https://corsproxy.io/?https%3A%2F%2Fwww.frommehelene.at%2Findex.php%3Fid%3D15";

const getMenu = async () => {
  console.log(`Fetching data from ${url}`);

  const result = await fetch(
    // Calling https://www.frommehelene.at/index.php?id=15 directly causes some SSL issues
    // as the certificate trust chain of this website is broken
    url,
    {
      next: { revalidate: 3600 },
    }
  );

  const html = await result.text();

  const root = parse(html);

  const rows = root.querySelectorAll("table.contenttable tr");

  const days = [];
  let weekdayCount = 0;

  let collector = [];

  const weekDateRange =
    root
      .querySelector("#content h1.csc-firstHeader")
      ?.textContent.replace("Menükarte ", "") ?? "";

  console.log(`Found ${rows.length} rows to process`);

  for (const row of rows) {
    const nextDay = weekdayStrings[weekdayCount];

    const content = row.querySelector("td:first-child")?.textContent.trim();
    const price = row.querySelector("td:last-child")?.textContent.trim();

    if (row.querySelector("td:first-child")?.textContent.startsWith(nextDay)) {
      if (collector.length > 0) {
        days.push(collector);
      }

      collector = [];
      weekdayCount++;
    } else if (content && price) {
      collector.push([content, price]);
    }
  }

  if (collector.length > 0) {
    days.push(collector);
  }

  console.log(`Days data collected: ${JSON.stringify(days)}`);

  return {
    days,
    timestamp: new Date().toLocaleString("de", { timeZone: "Europe/Vienna" }),
    weekDateRange,
  };
};

export default async function Page() {
  const { days, timestamp, weekDateRange } = await getMenu();

  return (
    <HomePage
      title="Fromme Helene Menu"
      emoji="🥩"
      telNumber="+4314069144"
      days={days}
      weekDateRange={weekDateRange}
      timestamp={timestamp}
      menuRenderer={marienRenderer}
    />
  );
}
