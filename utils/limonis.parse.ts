import cleaner from "./cleaner";

const weekdayStrings = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
];

const parser = (
  data: string
): { days: string[][][]; weekDateRange: string } => {
  let weekdayCount = 0;

  const weekdaysMenu = [];

  let collector = [];
  let startCollecting = false;

  const lines = data
    .split("\n")
    .map((str) => str.trim().replace(/  +/g, " "))
    .filter(Boolean);

  let weekDateRange = "";

  for (const line of lines) {
    const weekdaySearch = weekdayStrings[weekdayCount];

    console.log("SEARCHING FOR", weekdaySearch, line);

    if (line.startsWith("BIO TAGESGERICHTE KW")) {
      // Date info
      weekDateRange = line;
    } else if (
      weekdaySearch &&
      line.replaceAll(" ", "").toLowerCase() === weekdaySearch.toLowerCase()
    ) {
      if (collector.length > 0) {
        weekdaysMenu.push(collector);
      }

      collector = [];
      startCollecting = true;
      weekdayCount++;
    } else if (line.includes("BIO SAISONALE SUPPEN & EINTÖPFE")) {
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
      item.split("€").map((item) => cleaner(item.trim()))
    );
  });

  return {
    days: fixedDays,
    weekDateRange,
  };
};

export default parser;
