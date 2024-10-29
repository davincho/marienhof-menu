/* eslint-disable no-console */
"use cache";

import {
  unstable_cacheTag as cacheTag,
  unstable_cacheLife as cacheLife,
} from "next/cache";

import HomePage from "../../components/HomePage";
import { marienRenderer } from "../../utils/render";

import parser from "./../../utils/marify.parse";
import pdf from "./../pdfShim";

const getMenu = async () => {
  cacheTag("marie");
  cacheLife("minutes");

  console.info("Starting to fetch Marienhof", new Date().toLocaleString());

  const dataBuffer = await fetch(
    "http://www.restaurant-marienhof.at/restaurant/pdf/wochenmenue.pdf",
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
