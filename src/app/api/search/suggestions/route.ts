import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  return NextResponse.json({
    suggestions: await repository.searchTopicSuggestions(q, 6)
  });
}
