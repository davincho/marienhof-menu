/* eslint-disable no-console */
import { put, list, del } from "@vercel/blob";

import { PrismaClient } from "../../../../generated/prisma-client-js";
import dayjs from "../../../../utils/dayjs";
import limonisParser, {
  parseCalenderWeek,
} from "../../../../utils/limonis.parse";
import pdf from "../../../pdfShim";

const prisma = new PrismaClient();

export async function GET() {
  const files = await prisma.files.findMany({
    orderBy: {
      validFrom: "desc",
    },
  });

  return Response.json(files);
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename || !request.body) {
    return Response.error();
  }

  console.log("File received");

  const blob = await put(filename, request.body, {
    access: "public",
  });

  console.log("Uploading to Blob store finished");

  const blobUrl = blob.url;

  const dataBuffer = await fetch(blobUrl);

  const blobContent = await dataBuffer.arrayBuffer();

  const data = (await pdf(Buffer.from(blobContent))) as { text: string };

  const { weekDateRange } = limonisParser(data.text);

  const weekNumber = parseCalenderWeek(weekDateRange);

  console.log("Parsing of file finished");

  if (!weekNumber) {
    return Response.error();
  }

  await prisma.files.create({
    data: {
      validFrom: dayjs().week(weekNumber).startOf("week").toISOString(),
      url: blobUrl,
    },
  });

  return Response.json({});
}
