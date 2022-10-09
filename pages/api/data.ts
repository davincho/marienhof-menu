import type { NextApiRequest, NextApiResponse } from "next";
import pdf from "pdf-parse";

const weekdayStrings = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
];

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1, stale-while-revalidate=59"
  );

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
    } else if (line.startsWith("V WOCHENEMPFEHLUNG")) {
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

  res.status(200).json({ days: fixedDays, weekDateRange });
}
