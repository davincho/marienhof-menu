import HomePage from "../../components/HomePage";
import { paulRenderer } from "../../utils/render";

import parser from "./../../utils/paul.parse";
import pdf from "./../pdfShim";

const getMenu = async () => {
  const dataBuffer = await fetch(
    "http://www.paulandthemonkeys.at/wochenkarte/wochenkarte_download/",
    { next: { revalidate: 3600 } }
  );

  const blobContent = await dataBuffer.arrayBuffer();

  const data = (await pdf(Buffer.from(blobContent))) as { text: string };

  const { days, weekDateRange } = parser(data.text);

  return {
    days,
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
      menuRenderer={paulRenderer}
    />
  );
}
