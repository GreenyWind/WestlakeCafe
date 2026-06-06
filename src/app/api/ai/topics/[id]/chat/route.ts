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
  const referencedReplyNumbers = normalizeReplyNumbers(body?.referencedReplyNumbers);

  if (!message) {
    return NextResponse.json({ message: "消息不能为空。" }, { status: 400 });
  }

  const wantsStream = Boolean(body?.stream);

  try {
    if (!wantsStream) {
      return NextResponse.json(await aiService.chat(id, message, mode, messages, referencedReplyNumbers));
    }

    const result = await aiService.streamChat(id, message, mode, messages, referencedReplyNumbers);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        function send(event: string, data: unknown) {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        }

        try {
          send("meta", {
            mode: result.mode,
            referencedReplyNumbers: result.referencedReplyNumbers,
            warnings: result.warnings
          });

          for await (const delta of result.stream) {
            if (delta) {
              send("delta", { delta });
            }
          }

          send("done", {});
        } catch (error) {
          send("error", { message: publicAIErrorMessage(error, "AI 回答失败。") });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive"
      }
    });
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
    .map((item): AIConversationMessage | null => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const role = "role" in item ? item.role : "";
      const content = "content" in item ? String(item.content ?? "").trim() : "";
      const referencedReplyNumbers = normalizeReplyNumbers(
        "referencedReplyNumbers" in item ? item.referencedReplyNumbers : undefined
      );

      if ((role !== "user" && role !== "assistant") || !content) {
        return null;
      }

      return { role, content, referencedReplyNumbers };
    })
    .filter((item): item is AIConversationMessage => item !== null)
    .slice(-12);
}

function normalizeReplyNumbers(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((item) => Number(item))
        .filter((item) => Number.isInteger(item) && item > 0)
    )
  )
    .sort((a, b) => a - b)
    .slice(0, 8);
}
