import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { requireCurrentUser } from "@/lib/session";

type RouteParams = Promise<{ id: string; replyId: string }>;

export async function DELETE(_request: Request, { params }: { params: RouteParams }) {
  let user;

  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ message: "请先登录。" }, { status: 401 });
  }

  const { id, replyId } = await params;

  try {
    const reply = await repository.deleteReply(id, replyId, user.id);

    if (!reply) {
      return NextResponse.json({ message: "回复不存在。" }, { status: 404 });
    }

    return NextResponse.json(reply);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "你没有权限删除这条回复。" }, { status: 403 });
    }

    return NextResponse.json({ message: "删除回复失败。" }, { status: 500 });
  }
}
