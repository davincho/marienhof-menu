/* eslint-disable no-console */
"use cache";

import {
  unstable_cacheTag as cacheTag,
  unstable_cacheLife as cacheLife,
} from "next/cache";

import HomePage from "../../components/HomePage";
import { limonisRenderer } from "../../utils/render";

import { PrismaClient } from "./../../generated/prisma-client-js";
import dayjs from "./../../utils/dayjs";
import parser from "./../../utils/limonis.parse";
import pdf from "./../pdfShim";

const getMenu = async () => {
  cacheTag("limonis");
  cacheLife("minutes");

  const prisma = new PrismaClient();

  const file = await prisma.files.findFirst({
    orderBy: {
      validFrom: "desc",
    },
    where: {
      validFrom: {
        lte: dayjs().startOf("week").toISOString(),
      },
    },
  });

  const limonisUrl = file?.url;

  if (!limonisUrl) {
    throw new Error("No Limonis PDF found");
  }

  console.log(`Fetching ${limonisUrl}`);

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
      menuRenderer={limonisRenderer}
    />
  );
}
