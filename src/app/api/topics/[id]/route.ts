import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { requireCurrentUser } from "@/lib/session";
import type { TopicType } from "@/lib/types";

type RouteParams = Promise<{ id: string }>;
const topicTypes: TopicType[] = ["PAPER", "QUESTION", "IDEA", "RECOMMENDATION"];

export async function GET(_request: Request, { params }: { params: RouteParams }) {
  const { id } = await params;
  const topic = await repository.getTopicDetail(id);

  if (!topic) {
    return NextResponse.json({ message: "Topic 不存在。" }, { status: 404 });
  }

  return NextResponse.json(topic);
}

export async function DELETE(_request: Request, { params }: { params: RouteParams }) {
  let user;

  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ message: "请先登录。" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deleted = await repository.deleteTopic(id, user.id);

    if (!deleted) {
      return NextResponse.json({ message: "Topic 不存在。" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "你没有权限删除这个 topic。" }, { status: 403 });
    }

    return NextResponse.json({ message: "删除 topic 失败。" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: RouteParams }) {
  let user;

  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ message: "请先登录。" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  const type = String(body?.type ?? "QUESTION") as TopicType;
  const topicBody = String(body?.body ?? "").trim();

  if (!title || !topicBody || !topicTypes.includes(type)) {
    return NextResponse.json({ message: "请填写完整 topic 信息。" }, { status: 400 });
  }

  try {
    const topic = await repository.updateTopicMainPost(id, user.id, {
      title,
      type,
      body: topicBody,
      paperTitle: String(body?.paperTitle ?? "").trim() || undefined,
      paperUrl: String(body?.paperUrl ?? "").trim() || undefined
    });

    if (!topic) {
      return NextResponse.json({ message: "Topic 不存在。" }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "你没有权限编辑这个 topic。" }, { status: 403 });
    }

    return NextResponse.json({ message: "编辑 topic 失败。" }, { status: 500 });
  }
}
