/* eslint-disable no-console */
import { parse } from "node-html-parser";

import HomePage from "../../components/HomePage";
import { marienRenderer } from "../../utils/render";

import parser from "./../../utils/limonis.parse";
import pdf from "./../pdfShim";

const getMenu = async () => {
  const result = await fetch("https://limonis.at/was-gibts/");

  if (!result.ok) {
    console.error(result);
    throw new Error(`Could not fetch from Limonis`);
  }

  const html = await result.text();

  const root = parse(html);

  const link = root
    .querySelector('[aria-label="WOCHENKARTE"]')
    ?.getAttribute("href");

  if (!link) {
    throw new Error(`Could not find link to Wochenkarte PDF`);
  }

  const dataBuffer = await fetch(link, { next: { tags: ["data"] } });

  const blobContent = await dataBuffer.arrayBuffer();

  const data = (await pdf(Buffer.from(blobContent))) as { text: string };

  console.log("data", data.text);

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
      title="Limonis"
      emoji="🍋"
      days={days}
      weekDateRange={weekDateRange}
      timestamp={timestamp}
      menuRenderer={marienRenderer}
    />
  );
}
