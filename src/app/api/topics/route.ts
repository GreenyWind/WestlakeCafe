import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { requireCurrentUser } from "@/lib/session";
import type { TopicType } from "@/lib/types";

const topicTypes: TopicType[] = ["PAPER", "QUESTION", "IDEA", "RECOMMENDATION"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");

  return NextResponse.json(
    await repository.listTopics({
      disciplineSlug: url.searchParams.get("discipline") ?? undefined,
      tagSlug: url.searchParams.get("tag") ?? undefined,
      q: url.searchParams.get("q") ?? undefined,
      sort: sort === "latest" || sort === "popular" || sort === "active" ? sort : undefined
    })
  );
}

export async function POST(request: Request) {
  let user;

  try {
    user = await requireCurrentUser();
  } catch {
    return NextResponse.json({ message: "请先登录。" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  const type = String(body?.type ?? "QUESTION") as TopicType;
  const topicBody = String(body?.body ?? "").trim();
  const primaryDisciplineId = String(body?.primaryDisciplineId ?? "");
  const rawTagIds = Array.isArray(body?.tagIds) ? body.tagIds.map(String) : [];
  const rawNewTags = Array.isArray(body?.newTags) ? body.newTags.map(String) : [];

  if (!title || !topicBody || !primaryDisciplineId || !topicTypes.includes(type)) {
    return NextResponse.json({ message: "请填写完整 topic 信息。" }, { status: 400 });
  }

  const createdTags = await repository.ensureTags(rawNewTags, primaryDisciplineId);
  const tagIds = Array.from(new Set([...rawTagIds, ...createdTags.map((tag) => tag.id)]));

  const topic = await repository.createTopic({
    title,
    type,
    body: topicBody,
    paperTitle: String(body?.paperTitle ?? "").trim() || undefined,
    paperUrl: String(body?.paperUrl ?? "").trim() || undefined,
    primaryDisciplineId,
    tagIds,
    authorId: user.id
  });

  return NextResponse.json(topic, { status: 201 });
}
