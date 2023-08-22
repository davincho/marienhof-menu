/* eslint-disable no-console */

import { Octokit } from "@octokit/core";

import HomePage from "../../components/HomePage";
import { limonisRenderer } from "../../utils/render";

import parser from "./../../utils/limonis.parse";
import pdf from "./../pdfShim";

const getMenu = async () => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_KEY,
  });

  const test = await octokit.request(
    "GET /repos/davincho/marienhof-menu/issues/1",
    {
      owner: "davincho",
      repo: "marienhof-menu",
      issue_number: 1,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
        cache: "no-store",
      },
    }
  );

  const regex = /\((.*?)\)/;
  const match = test.data.body.match(regex);
  const limonisUrl = match ? match[1] : null;

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
