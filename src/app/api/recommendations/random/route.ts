import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? 4);
  return NextResponse.json(await repository.listRandomTopics(limit));
}
