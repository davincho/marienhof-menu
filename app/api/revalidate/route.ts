import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const paths = ["marie", "paul", "helene", 'limonis'];

export async function GET(request: NextRequest) {
  revalidateTag("data");

  const base = request.nextUrl.origin;

  await Promise.all(paths.map((path) => fetch(`${base}/${path}`)));

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
