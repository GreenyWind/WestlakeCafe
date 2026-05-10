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
  const topic = await repository.getTopicDetail(id);

  if (!topic) {
    return NextResponse.json({ message: "Topic 不存在。" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const replyBody = String(body?.body ?? "").trim();

  if (!replyBody) {
    return NextResponse.json({ message: "回复内容不能为空。" }, { status: 400 });
  }

  const reply = await repository.createReply({
    topicId: id,
    authorId: user.id,
    body: replyBody
  });

  return NextResponse.json(reply, { status: 201 });
}
