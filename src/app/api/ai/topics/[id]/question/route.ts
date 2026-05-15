import { NextResponse } from "next/server";
import { aiService } from "@/lib/ai-service";
import { publicAIErrorMessage } from "@/lib/ai-errors";

type RouteParams = Promise<{ id: string }>;

export async function POST(request: Request, { params }: { params: RouteParams }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const question = String(body?.question ?? "").trim();

  if (!question) {
    return NextResponse.json({ message: "问题不能为空。" }, { status: 400 });
  }

  try {
    return NextResponse.json(await aiService.answerQuestion(id, question));
  } catch (error) {
    if (error instanceof Error && error.message === "TOPIC_NOT_FOUND") {
      return NextResponse.json({ message: "Topic 不存在。" }, { status: 404 });
    }

    return NextResponse.json(
      { message: publicAIErrorMessage(error, "AI 回答失败。") },
      { status: 500 }
    );
  }
}
