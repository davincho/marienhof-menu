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
  const lines = data
    .split("\n")
    .map((str) => str.trim().replace(/  +/g, " "))
    .map((str) => str.trim().replace(/ —( V)? ([A-Z]\) ?)*/g, ""))
    .filter(Boolean);

  const weekdaysMenu = [];
  let weekdayCount = 0;
  let collector = [];
  let startCollecting = false;
  let weekDateRange = "";

  for (const line of lines) {
    const weekdaySearch = weekdayStrings[weekdayCount];

    if (line.startsWith("von Montag")) {
      // Date info
      weekDateRange = line;
    } else if (line.replaceAll(" ", "").startsWith(weekdaySearch)) {
      if (collector.length > 0) {
        weekdaysMenu.push(collector);
      }

      collector = [];
      startCollecting = true;
      weekdayCount++;
    } else if (
      line.includes("Allergieinformation") ||
      line.includes("V = vegetarisch") ||
      line.includes("WIR SCHLIEßEN")
    ) {
      if (collector.length > 0) {
        weekdaysMenu.push(collector);
      }

      collector = [];
      startCollecting = false;
    } else if (startCollecting) {
      collector.push(line);
    }
  }

  const fixedDays = weekdaysMenu.map((weekday) => {
    const fixedWeekDay = [];
    let dayCollector = [];

    for (const part of weekday) {
      if (
        /^(INTERNATIONAL|SUPPE|WIENER KÜCHE|PASTA|FISCH)/.test(part) &&
        dayCollector.length > 0
      ) {
        fixedWeekDay.push(dayCollector.join(" "));
        dayCollector = [];
      }
      dayCollector.push(part);
    }

    if (dayCollector.length > 0) {
      fixedWeekDay.push(dayCollector.join(" "));
    }

    return fixedWeekDay.map((day) => {
      const result =
        // eslint-disable-next-line unicorn/better-regex
        /(INTERNATIONAL|SUPPE|WIENER KÜCHE|PASTA|FISCH)(\D*)([0-9.]+) €/d.exec(
          day
        );

      if (!result) {
        return [];
      }

      const [, menuCateogry, menuName, menuPrice] = result;

      return [menuCateogry, menuName, menuPrice].map((str) => str.trim());
    });
  });

  return {
    days: fixedDays,
    weekDateRange,
  };
};

export default parser;
