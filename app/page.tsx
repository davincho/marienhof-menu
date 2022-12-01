import parse from "./../utils/marify.parse";
import HomePage from "./HomePage";
import pdf from "./pdfShim";
import { marienRenderer } from "./render";

const getMenu = async () => {
  const dataBuffer = await fetch(
    "http://www.restaurant-marienhof.at/restaurant/pdf/wochenmenue.pdf",
    { next: { revalidate: 3600 } }
  );

  const blobContent = await dataBuffer.arrayBuffer();

  const data = (await pdf(Buffer.from(blobContent))) as { text: string };

  const { days, weekDateRange } = parse(data.text);

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
