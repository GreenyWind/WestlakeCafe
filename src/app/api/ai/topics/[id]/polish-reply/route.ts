import { NextResponse } from "next/server";
import { aiService } from "@/lib/ai-service";
import { publicAIErrorMessage } from "@/lib/ai-errors";

type RouteParams = Promise<{ id: string }>;

export async function POST(request: Request, { params }: { params: RouteParams }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const input = String(body?.input ?? "").trim();

  if (!input) {
    return NextResponse.json({ message: "草稿不能为空。" }, { status: 400 });
  }

  try {
    return NextResponse.json(await aiService.polishReply(id, input));
  } catch (error) {
    if (error instanceof Error && error.message === "TOPIC_NOT_FOUND") {
      return NextResponse.json({ message: "Topic 不存在。" }, { status: 404 });
    }

    return NextResponse.json(
      { message: publicAIErrorMessage(error, "整理草稿失败。") },
      { status: 500 }
    );
  }
}
