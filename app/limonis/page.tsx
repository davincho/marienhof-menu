/* eslint-disable no-console */

import HomePage from "../../components/HomePage";
import { marienRenderer } from "../../utils/render";

import parser from "./../../utils/limonis.parse";
import pdf from "./../pdfShim";

const getMenu = async () => {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error("Could not access Redis");
  }

  // const limonisUrl = await kv.hget<string>("limonis", "url");

  const kvData = await fetch(
    `${process.env.KV_REST_API_URL}/hget/limonis/url`,
    {
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
      next: { tags: ["data-limonis"] },
    }
  );

  const { result: limonisUrl } = await kvData.json();

  if (!limonisUrl) {
    throw new Error("No Limonis URL found");
  }

  const dataBuffer = await fetch(limonisUrl, { next: { tags: ["data"] } });

  const blobContent = await dataBuffer.arrayBuffer();

  const data = (await pdf(Buffer.from(blobContent))) as { text: string };

  const { days, weekDateRange } = parser(data.text);

  return {
    days,
    weekDateRange,
    limonisUrl,
    timestamp: new Date().toLocaleString("de", { timeZone: "Europe/Vienna" }),
  };
};

export default async function Page() {
  const { days, timestamp, weekDateRange, limonisUrl } = await getMenu();

  console.log("limonisUrl", limonisUrl);

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
