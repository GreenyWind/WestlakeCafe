import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";

type RouteParams = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: RouteParams }) {
  const { id } = await params;
  const topic = await repository.getTopicDetail(id);

  if (!topic) {
    return NextResponse.json({ message: "Topic 不存在。" }, { status: 404 });
  }

  return NextResponse.json(topic);
}
