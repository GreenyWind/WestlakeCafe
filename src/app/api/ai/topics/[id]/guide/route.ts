import { NextResponse } from "next/server";
import { aiService } from "@/lib/ai-service";

type RouteParams = Promise<{ id: string }>;

export async function POST(_request: Request, { params }: { params: RouteParams }) {
  const { id } = await params;

  try {
    return NextResponse.json(await aiService.generateTopicGuide(id));
  } catch (error) {
    if (error instanceof Error && error.message === "TOPIC_NOT_FOUND") {
      return NextResponse.json({ message: "Topic 不存在。" }, { status: 404 });
    }

    return NextResponse.json({ message: "生成导读失败。" }, { status: 500 });
  }
}
