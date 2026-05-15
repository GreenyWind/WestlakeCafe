import { NextResponse } from "next/server";
import { aiService } from "@/lib/ai-service";
import { publicAIErrorMessage } from "@/lib/ai-errors";
import { getCurrentUser } from "@/lib/session";
import { repository } from "@/lib/repository";

type RouteParams = Promise<{ id: string }>;

export async function POST(request: Request, { params }: { params: RouteParams }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  try {
    const [topic, user] = await Promise.all([repository.getTopicDetail(id), getCurrentUser()]);

    if (!topic) {
      return NextResponse.json({ message: "Topic 不存在。" }, { status: 404 });
    }

    const requestedPersist = body?.persist !== false;
    const canPersist = Boolean(user && user.id === topic.authorId);
    const persist = requestedPersist && canPersist;

    return NextResponse.json({
      ...(await aiService.generateTopicGuide(id, { persist })),
      temporary: !persist
    });
  } catch (error) {
    if (error instanceof Error && error.message === "TOPIC_NOT_FOUND") {
      return NextResponse.json({ message: "Topic 不存在。" }, { status: 404 });
    }

    await aiService.markTopicGuideFailed(id).catch(() => undefined);

    return NextResponse.json(
      { message: publicAIErrorMessage(error, "生成导读失败。") },
      { status: 500 }
    );
  }
}
