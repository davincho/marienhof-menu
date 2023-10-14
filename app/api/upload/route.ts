import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";

import { PrismaClient } from "./../../../generated/prisma-client-js";

const prisma = new PrismaClient();

// export async function GET() {
//   const result = await prisma.files.create({
//     data: {
//       validFrom: new Date(),
//       url: "http://www.google.com",
//     },
//     select: {
//       id: true,
//       url: true,
//     },
//   });

//   return NextResponse.json(result);
// }

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return Response.error();
  }

  const blob = await put(filename, request.body, {
    access: "public",
  });

  const rs = await db.execute({
    sql: "UPDATE files SET url = $newUrl WHERE name = 'next'",
    args: { newUrl: blob.url },
  });

  return NextResponse.json(blob);
}
