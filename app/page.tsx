import https from "node:http";

import HomePage from "./HomePage";
import pdf from "./pdfShim";

const weekdayStrings = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
];

export const revalidate = 3600;

const getMenu = async () => {
  const pdfContent = await new Promise<Uint8Array>((resolve) => {
    https.get(
      "http://www.restaurant-marienhof.at/restaurant/pdf/wochenmenue.pdf",
      (response) => {
        const buffer: Uint8Array[] = [];

        response.on("data", (res) => {
          buffer.push(res);
        });

        response.on("end", () => {
          resolve(Buffer.concat(buffer));
        });
      }
    );
  });

  const weekdaysMenu = [];

  const data = (await pdf(Buffer.from(pdfContent))) as { text: string };

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
    days: fixedDays,
    weekDateRange,
    timestamp: new Date().toLocaleString("de", { timeZone: "Europe/Vienna" }),
  };
};

export default async function Page() {
  const { days, timestamp, weekDateRange } = await getMenu();

  return (
    <HomePage days={days} weekDateRange={weekDateRange} timestamp={timestamp} />
  );
}
