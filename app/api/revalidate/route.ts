import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const paths = ["marie", "limonis"];

export async function GET(request: NextRequest) {
  await Promise.all(paths.map((path) => revalidatePath(path)));

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
