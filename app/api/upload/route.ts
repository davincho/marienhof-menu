/* eslint-disable no-console */
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import dayjs from "../../../utils/dayjs";

import { PrismaClient } from "./../../../generated/prisma-client-js";
import limonisParser, {
  parseCalenderWeek,
} from "./../../../utils/limonis.parse";
import pdf from "./../../pdfShim";

const prisma = new PrismaClient();

export async function GET() {
  // await prisma.files.delete();

  // const result = await prisma.files.create({
  //   data: {
  //     validFrom: new Date(),
  //     url: "https://github.com/davincho/marienhof-menu/files/12395763/KW34_Wochenkarte_Bio.Kantine_indd.pdf",
  //   },
  //   select: {
  //     id: true,
  //     url: true,
  //   },
  // });

  return NextResponse.json({
    week: dayjs().week(),
    date: dayjs().week(44).startOf("week").format("YYYY-MM-DD"),
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
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

  const { days, weekDateRange } = limonisParser(data.text);

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

  return NextResponse.json({
    days,
    weekDateRange,
  });
}
