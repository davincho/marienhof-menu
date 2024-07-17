/* eslint-disable no-console */
import HomePage from "../../components/HomePage";
import { marienRenderer } from "../../utils/render";

import parser from "./../../utils/marify.parse";
import pdf from "./../pdfShim";

const getMenu = async () => {
  console.info("Starting to fetch Marienhof", new Date().toLocaleString());

  const dataBuffer = await fetch(
    "http://www.restaurant-marienhof.at/restaurant/pdf/wochenmenue.pdf",
    { next: { revalidate: 3600 } },
  );

  console.info("Fetching done", new Date().toLocaleString());

  const blobContent = await dataBuffer.arrayBuffer();

  const data = (await pdf(Buffer.from(blobContent))) as { text: string };

  const { days, weekDateRange } = parser(data.text);

  return {
    days,
    weekDateRange,
    timestamp: dataBuffer.headers.get("date")!,
  };
};

export default async function Page() {
  const { days, timestamp, weekDateRange } = await getMenu();

  return (
    <HomePage
      title="Marienhof Menu"
      emoji="🧑🏼‍🍳"
      telNumber="+431408890530"
      days={days}
      weekDateRange={weekDateRange}
      timestamp={timestamp}
      menuRenderer={marienRenderer}
    />
  );
}
