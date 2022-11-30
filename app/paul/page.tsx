import HomePage from "./../HomePage";
import pdf from "./../pdfShim";

type RegExpMatchArrayWithIndices = RegExpMatchArray & {
  indices: [number, number][];
};

const weekdayStrings = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
];

const getMenu = async () => {
  const dataBuffer = await fetch(
    "http://www.paulandthemonkeys.at/wochenkarte/wochenkarte_download/",
    { next: { revalidate: 3600 } }
  );

  const blobContent = await dataBuffer.arrayBuffer();

  const data = (await pdf(Buffer.from(blobContent))) as { text: string };

  const lines = data.text
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
    } else if (line.includes("WOCHENEMPFEHLUNG")) {
      weekdaysMenu.push(collector);
      startCollecting = false;
    } else if (startCollecting) {
      collector.push(line);
    }
  }

  // Fix weekdays menu
  /*
  [
    'SUPPEMinestroneVegan2.90 €',
    'INTERNATIONALHühnerragout „Bakonyi“ mit Nockerln und Sauerrahm9.80 €',
    'INTERNATIONALPaella mit Garnelen und Chorizo9.90 €',
    'WIENER KÜCHE',
    'Lauch-Kartoffel-Auflauf mit Sauerrahm und Blattsalat',
    '9.70 €',
    'INTERNATIONALRote Linsen-Dal mit ReisVegan9.80 €'
  ]
  */

  const fixedDays = weekdaysMenu.map((weekday) => {
    const fixedWeekDay = [];
    let dayCollector = [];

    for (const part of weekday) {
      const result =
        // eslint-disable-next-line unicorn/better-regex
        /(INTERNATIONAL|SUPPE|WIENER KÜCHE|PASTA)?(\D*)?([0-9.]+ €)?/d.exec(
          part
        );

      if (result) {
        const [, menuCateogry, menuName, menuPrice] = (
          result as RegExpMatchArrayWithIndices
        ).indices;

        if (menuCateogry) {
          if (dayCollector.length > 0) {
            fixedWeekDay.push([
              `${dayCollector[0]} - ${dayCollector[1]}`,
              dayCollector[2],
            ]);
            dayCollector = [];
          }

          dayCollector.push(part.slice(...menuCateogry));
        }

        if (menuName) {
          dayCollector.push(part.slice(...menuName));
        }

        if (menuPrice) {
          dayCollector.push(part.slice(...menuPrice));
        }
      }
    }

    return fixedWeekDay;
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
    <HomePage
      title="Paul and the Monkeys"
      emoji="🐵"
      days={days}
      weekDateRange={weekDateRange}
      timestamp={timestamp}
    />
  );
}
