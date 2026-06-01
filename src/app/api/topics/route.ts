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
  const requestedPrimaryDisciplineId = String(body?.primaryDisciplineId ?? "").trim();
  const rawDisciplineIds = Array.isArray(body?.disciplineIds) ? body.disciplineIds.map(String) : [];
  const rawTagIds = Array.isArray(body?.tagIds) ? body.tagIds.map(String) : [];
  const rawNewTags = Array.isArray(body?.newTags) ? body.newTags : [];

  if (!title || !topicBody || !topicTypes.includes(type)) {
    return NextResponse.json({ message: "请填写完整 topic 信息。" }, { status: 400 });
  }

  const newTagInputs = rawNewTags.map((tag: unknown) => {
    const value = tag as {
      name?: unknown;
      disciplineIds?: unknown;
      newDisciplines?: unknown;
      reason?: unknown;
    };

    return {
      name: String(value?.name ?? "").trim(),
      disciplineIds: Array.isArray(value?.disciplineIds) ? value.disciplineIds.map(String) : [],
      newDisciplines: Array.isArray(value?.newDisciplines)
        ? value.newDisciplines.map((discipline: unknown) => {
            const item = discipline as { name?: unknown; parentId?: unknown };
            return {
              name: String(item?.name ?? "").trim(),
              parentId: String(item?.parentId ?? "").trim()
            };
          })
        : [],
      reason: String(value?.reason ?? "").trim()
    };
  });
  const newTagInputsWithCreatedDisciplines = [];
  const createdDisciplineIds: string[] = [];

  for (const tag of newTagInputs) {
    const createdDisciplines = await repository.ensurePendingDisciplines({
      disciplines: tag.newDisciplines ?? [],
      userId: user.id
    });

    createdDisciplineIds.push(...createdDisciplines.map((discipline) => discipline.id));
    newTagInputsWithCreatedDisciplines.push({
      ...tag,
      disciplineIds: [
        ...tag.disciplineIds,
        ...createdDisciplines.map((discipline) => discipline.id)
      ],
      newDisciplines: []
    });
  }

  const createdTags = await repository.createPendingTags({
    userId: user.id,
    tags: newTagInputsWithCreatedDisciplines
  });
  const tagIds = Array.from(new Set([...rawTagIds, ...createdTags.map((tag) => tag.id)]));
  const disciplineIds = Array.from(new Set([...rawDisciplineIds, ...createdDisciplineIds]));
  const primaryDisciplineId =
    requestedPrimaryDisciplineId && disciplineIds.includes(requestedPrimaryDisciplineId)
      ? requestedPrimaryDisciplineId
      : disciplineIds[0];

  if (!primaryDisciplineId || disciplineIds.length === 0 || tagIds.length === 0) {
    return NextResponse.json({ message: "请至少选择或新建一个 tag，并指定学科归属。" }, { status: 400 });
  }

  const topic = await repository.createTopic({
    title,
    type,
    body: topicBody,
    paperTitle: String(body?.paperTitle ?? "").trim() || undefined,
    paperUrl: String(body?.paperUrl ?? "").trim() || undefined,
    primaryDisciplineId,
    disciplineIds,
    tagIds,
    authorId: user.id
  });

  await repository.saveTopicDraftPreference({
    userId: user.id,
    tagIds,
    disciplineIds
  });

  return NextResponse.json(topic, { status: 201 });
}
