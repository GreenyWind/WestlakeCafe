import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { requireCurrentUser } from "@/lib/session";

type RouteParams = Promise<{ id: string }>;

export async function POST(request: Request, { params }: { params: RouteParams }) {
  let user;

  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ message: "请先登录。" }, { status: 401 });
  }

  const { id } = await params;
  const topic = await repository.getTopicDetail(id, { incrementView: false });

  if (!topic) {
    return NextResponse.json({ message: "Topic 不存在。" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const replyBody = String(body?.body ?? "").trim();
  const parentReplyId = String(body?.parentReplyId ?? "").trim();

  if (!replyBody) {
    return NextResponse.json({ message: "回复内容不能为空。" }, { status: 400 });
  }

  if (parentReplyId) {
    const parentReply = topic.replies.find((reply) => reply.id === parentReplyId);

    if (!parentReply || parentReply.deletedAt) {
      return NextResponse.json({ message: "被回复的楼层不存在或已删除。" }, { status: 400 });
    }
  }

  const reply = await repository.createReply({
    topicId: id,
    authorId: user.id,
    body: replyBody,
    parentReplyId: parentReplyId || undefined
  });

  return NextResponse.json(reply, { status: 201 });
}
