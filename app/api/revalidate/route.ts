import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const paths = ["marie", "limonis"];

export async function GET(request: NextRequest) {
  revalidatePath("/marie");
  revalidatePath("/limonis");

  const base = request.nextUrl.origin;

  await Promise.all(paths.map((path) => fetch(`${base}/${path}`)));

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
