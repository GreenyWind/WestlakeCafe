import { NextResponse } from "next/server";
import { aiService } from "@/lib/ai-service";
import { publicAIErrorMessage } from "@/lib/ai-errors";
import type { AIChatMode, AIConversationMessage } from "@/lib/types";

type RouteParams = Promise<{ id: string }>;

const modes = new Set<AIChatMode>(["ask", "clarify", "draft"]);

export async function POST(request: Request, { params }: { params: RouteParams }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const message = String(body?.message ?? "").trim();
  const rawMode = String(body?.mode ?? "ask") as AIChatMode;
  const mode = modes.has(rawMode) ? rawMode : "ask";
  const messages = normalizeMessages(body?.messages);

  if (!message) {
    return NextResponse.json({ message: "消息不能为空。" }, { status: 400 });
  }

  try {
    return NextResponse.json(await aiService.chat(id, message, mode, messages));
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

function normalizeMessages(value: unknown): AIConversationMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const role = "role" in item ? item.role : "";
      const content = "content" in item ? String(item.content ?? "").trim() : "";

      if ((role !== "user" && role !== "assistant") || !content) {
        return null;
      }

      return { role, content } satisfies AIConversationMessage;
    })
    .filter((item): item is AIConversationMessage => Boolean(item))
    .slice(-12);
}
