const weekdayStrings = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
];

export const parseCalenderWeek = (dateStr: string): number | undefined => {
  // Example: BIO TAGESGERICHTE KW 28 / 10.07. BIS 14.07.
  const result = dateStr.match(/.+kw (\d+)/i);

  if (!result || result.length < 2) {
    return;
  }

  return Number.parseInt(result?.[1], 10);
};

const parser = (
  data: string,
): { days: string[][][]; weekDateRange: string } => {
  let weekdayCount = 0;

  const weekdaysMenu = [];

  let collector = [];
  let startCollecting = false;

  const lines = data
    .split("\n")
    .map((str) => str.trim().replaceAll(/  +/g, " "))
    .filter(Boolean);

  let weekDateRange = "";

  for (const line of lines) {
    const weekdaySearch = weekdayStrings[weekdayCount];

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
    } else if (line.includes("Fleisch oder Fisch aus Österreich")) {
      weekdaysMenu.push(collector);
      startCollecting = false;
    } else if (startCollecting) {
      collector.push(line);
    }
  }

  // fix some line breaks and remove tages dessert
  const fixedDays = weekdaysMenu.map((weekday) => {
    const fixedDay = [];
    let itemsParts = [];
    for (const weekdayParts of weekday) {
      if (weekdayParts.includes("/ ")) {
        itemsParts.push(weekdayParts);
        fixedDay.push([
          itemsParts.join(" "),
          fixedDay.length === 0 ? "6,60" : "7,20",
        ]);
        itemsParts = [];
      } else {
        itemsParts.push(weekdayParts);
      }
    }

    return fixedDay.slice(0, 2);
  });

  return {
    days: fixedDays,
    weekDateRange,
  };
};

export default parser;
