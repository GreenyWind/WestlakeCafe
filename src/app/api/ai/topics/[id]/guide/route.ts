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
    const [topic, user] = await Promise.all([repository.getTopicDetail(id, { incrementView: false }), getCurrentUser()]);

    if (!topic) {
      return NextResponse.json({ message: "Topic 不存在。" }, { status: 404 });
    }

    const canPersist = Boolean(user && user.id === topic.authorId);
    const wantsStream = Boolean(body?.stream);

    if (!canPersist) {
      return NextResponse.json({ message: "只有楼主可以生成主楼导读。" }, { status: 403 });
    }

    if (wantsStream) {
      const result = await aiService.streamTopicGuide(id);
      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          function send(event: string, data: unknown) {
            controller.enqueue(
              encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
            );
          }

          let content = "";

          try {
            send("meta", {
              status: "PENDING"
            });

            for await (const delta of result.stream) {
              if (delta) {
                content += delta;
                send("delta", { delta });
              }
            }

            if (!content.trim()) {
              throw new Error("AI_GUIDE_EMPTY_RESPONSE");
            }

            const guide = await repository.upsertAIGuide(id, content, result.model);

            send("done", {
              status: guide.status,
              model: guide.model,
              updatedAt: guide.updatedAt
            });
          } catch (error) {
            await aiService.markTopicGuideFailed(id).catch(() => undefined);

            send("error", { message: publicAIErrorMessage(error, "生成导读失败。") });
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
    }

    return NextResponse.json(await aiService.generateTopicGuide(id, { persist: true }));
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
