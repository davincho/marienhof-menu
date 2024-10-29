import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const paths = ["marie", "limonis"];

import {} from "next/cache";

export async function GET() {
  await Promise.all(paths.map((path) => revalidateTag(path)));

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
