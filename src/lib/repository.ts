import type {
  AIJobStatus,
  AIGuide as PrismaAIGuide,
  Discipline as PrismaDiscipline,
  Prisma,
  Reply as PrismaReply,
  TagDiscipline as PrismaTagDiscipline,
  Tag as PrismaTag,
  Topic as PrismaTopic,
  User as PrismaUser
} from "@prisma/client";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import type {
  AIGuide,
  CreateReplyInput,
  CreateTopicInput,
  Discipline,
  PublicUser,
  Reply,
  Tag,
  Topic,
  TopicDetail,
  TopicListItem,
  User
} from "@/lib/types";
import { slugify } from "@/lib/utils";

type TopicQuery = {
  disciplineSlug?: string;
  tagSlug?: string;
  q?: string;
  sort?: "latest" | "active" | "popular";
};

type TopicWithRelations = PrismaTopic & {
  author: PrismaUser;
  primaryDiscipline: PrismaDiscipline;
  tags: Array<{ tag: PrismaTag & { disciplines?: Array<Pick<PrismaTagDiscipline, "disciplineId">> } }>;
  aiGuide: PrismaAIGuide | null;
  _count: { replies: number };
};

type TopicDetailWithRelations = TopicWithRelations & {
  replies: Array<PrismaReply & { author: PrismaUser }>;
};

function toDateString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

function toPublicUser(user: PrismaUser): PublicUser {
  const { passwordHash, ...rest } = user;
  return {
    ...rest,
    school: rest.school ?? undefined,
    department: rest.department ?? undefined,
    researchField: rest.researchField ?? undefined,
    createdAt: toDateString(rest.createdAt),
    updatedAt: toDateString(rest.updatedAt)
  };
}

function toUser(user: PrismaUser): User {
  return {
    ...toPublicUser(user),
    passwordHash: user.passwordHash
  };
}

function toDiscipline(discipline: PrismaDiscipline): Discipline {
  return {
    ...discipline,
    parentId: discipline.parentId,
    sortOrder: discipline.sortOrder
  };
}

function toTag(tag: PrismaTag & { disciplines?: Array<Pick<PrismaTagDiscipline, "disciplineId">> }): Tag {
  return {
    ...tag,
    disciplineId: tag.disciplineId,
    disciplineIds: tag.disciplines?.map((item) => item.disciplineId) ?? (tag.disciplineId ? [tag.disciplineId] : [])
  };
}

function toAIGuide(guide: PrismaAIGuide | null): AIGuide | undefined {
  if (!guide) {
    return undefined;
  }

  return {
    ...guide,
    createdAt: toDateString(guide.createdAt),
    updatedAt: toDateString(guide.updatedAt)
  };
}

function toTopicBase(topic: PrismaTopic & { tags?: Array<{ tag: PrismaTag }> }): Topic {
  return {
    id: topic.id,
    title: topic.title,
    type: topic.type,
    body: topic.body,
    paperTitle: topic.paperTitle ?? undefined,
    paperUrl: topic.paperUrl ?? undefined,
    authorId: topic.authorId,
    primaryDisciplineId: topic.primaryDisciplineId,
    status: topic.status,
    tagIds: topic.tags?.map((item) => item.tag.id) ?? [],
    viewCount: topic.viewCount,
    createdAt: toDateString(topic.createdAt),
    updatedAt: toDateString(topic.updatedAt),
    lastActivityAt: toDateString(topic.lastActivityAt)
  };
}

function toTopicListItem(topic: TopicWithRelations): TopicListItem {
  const guideUpdatedAt = topic.aiGuide?.updatedAt;
  const isGuideOlderThanAWeek =
    guideUpdatedAt && Date.now() - guideUpdatedAt.getTime() > 7 * 24 * 60 * 60 * 1000;

  return {
    ...toTopicBase(topic),
    author: toPublicUser(topic.author),
    primaryDiscipline: toDiscipline(topic.primaryDiscipline),
    tags: topic.tags.map((item) => toTag(item.tag)),
    replyCount: topic._count.replies,
    aiGuide: toAIGuide(topic.aiGuide),
    aiGuideMeta: {
      repliesSinceGuide: 0,
      isStale: Boolean(topic.aiGuide?.status === "COMPLETED" && isGuideOlderThanAWeek)
    }
  };
}

function toReply(reply: PrismaReply & { author?: PrismaUser }): Reply & { author?: PublicUser } {
  return {
    id: reply.id,
    topicId: reply.topicId,
    authorId: reply.authorId,
    body: reply.body,
    parentReplyId: reply.parentReplyId ?? undefined,
    deletedAt: reply.deletedAt ? toDateString(reply.deletedAt) : undefined,
    createdAt: toDateString(reply.createdAt),
    updatedAt: toDateString(reply.updatedAt),
    author: reply.author ? toPublicUser(reply.author) : undefined
  };
}

function includeTopicRelations() {
  return {
    author: true,
    primaryDiscipline: true,
    tags: {
      include: {
        tag: {
          include: {
            disciplines: true
          }
        }
      }
    },
    aiGuide: true,
    _count: {
      select: {
        replies: true
      }
    }
  } satisfies Prisma.TopicInclude;
}

async function getDescendantDisciplineIds(disciplineId: string) {
  const all = await prisma.discipline.findMany({
    select: {
      id: true,
      parentId: true
    }
  });
  const result = new Set<string>([disciplineId]);
  let changed = true;

  while (changed) {
    changed = false;
    all.forEach((discipline) => {
      if (discipline.parentId && result.has(discipline.parentId) && !result.has(discipline.id)) {
        result.add(discipline.id);
        changed = true;
      }
    });
  }

  return Array.from(result);
}

async function uniqueTagSlug(name: string) {
  const base = slugify(name) || `tag-${Date.now()}`;
  let candidate = base;
  let counter = 2;

  while (await prisma.tag.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}

export const repository = {
  async getPublicUser(userId: string): Promise<PublicUser | null> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user ? toPublicUser(user) : null;
  },

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    return user ? toUser(user) : null;
  },

  async createUser(input: {
    name: string;
    email: string;
    password: string;
    department?: string;
    researchField?: string;
  }): Promise<PublicUser> {
    const existing = await this.findUserByEmail(input.email);
    if (existing) {
      throw new Error("EMAIL_EXISTS");
    }

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash: hashPassword(input.password),
        school: "示例大学",
        department: input.department || null,
        researchField: input.researchField || null
      }
    });

    return toPublicUser(user);
  },

  async validateLogin(email: string, password: string): Promise<PublicUser | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return null;
    }

    return toPublicUser(user);
  },

  async listDisciplines(): Promise<Array<Discipline & { children: Discipline[] }>> {
    const roots = await prisma.discipline.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: "asc" },
      include: {
        children: {
          orderBy: { sortOrder: "asc" }
        }
      }
    });

    return roots.map((discipline) => ({
      ...toDiscipline(discipline),
      children: discipline.children.map(toDiscipline)
    }));
  },

  async getDisciplineBySlug(slug: string): Promise<Discipline | null> {
    const discipline = await prisma.discipline.findUnique({ where: { slug } });
    return discipline ? toDiscipline(discipline) : null;
  },

  async listTags(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        disciplines: true
      }
    });
    return tags.map(toTag);
  },

  async listTopics(query: TopicQuery = {}): Promise<TopicListItem[]> {
    const where: Prisma.TopicWhereInput = {
      status: "PUBLISHED"
    };

    if (query.disciplineSlug) {
      const discipline = await prisma.discipline.findUnique({
        where: { slug: query.disciplineSlug }
      });

      if (!discipline) {
        return [];
      }

      where.primaryDisciplineId = {
        in: await getDescendantDisciplineIds(discipline.id)
      };

      where.OR = [
        { primaryDisciplineId: where.primaryDisciplineId },
        {
          tags: {
            some: {
              tag: {
                OR: [
                  {
                    disciplineId: {
                      in: await getDescendantDisciplineIds(discipline.id)
                    }
                  },
                  {
                    disciplines: {
                      some: {
                        disciplineId: {
                          in: await getDescendantDisciplineIds(discipline.id)
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      ];

      delete where.primaryDisciplineId;
    }

    if (query.tagSlug) {
      where.tags = {
        some: {
          tag: {
            slug: query.tagSlug
          }
        }
      };
    }

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: "insensitive" } },
        { body: { contains: query.q, mode: "insensitive" } },
        { paperTitle: { contains: query.q, mode: "insensitive" } }
      ];
    }

    const orderBy: Prisma.TopicOrderByWithRelationInput =
      query.sort === "popular"
        ? { viewCount: "desc" }
        : query.sort === "latest"
          ? { createdAt: "desc" }
          : { lastActivityAt: "desc" };

    const topics = await prisma.topic.findMany({
      where,
      orderBy,
      include: includeTopicRelations()
    });

    return topics.map((topic) => toTopicListItem(topic as TopicWithRelations));
  },

  async listRandomTopics(limit = 4): Promise<TopicListItem[]> {
    const topics = await prisma.topic.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { lastActivityAt: "desc" },
      take: 50,
      include: includeTopicRelations()
    });

    return topics
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .map((topic) => toTopicListItem(topic as TopicWithRelations));
  },

  async getTopicDetail(topicId: string, options: { incrementView?: boolean } = {}): Promise<TopicDetail | null> {
    if (options.incrementView ?? true) {
      await prisma.topic.updateMany({
        where: { id: topicId, status: "PUBLISHED" },
        data: { viewCount: { increment: 1 } }
      });
    }

    const topic = await prisma.topic.findFirst({
      where: { id: topicId, status: "PUBLISHED" },
      include: {
        ...includeTopicRelations(),
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: true
          }
        }
      }
    });

    if (!topic) {
      return null;
    }

    const detail = topic as TopicDetailWithRelations;

    return {
      ...toTopicListItem(detail),
      aiGuideMeta: await this.getAIGuideMeta(topicId),
      replies: detail.replies.map((reply) => {
        const mapped = toReply(reply);
        if (!mapped.author) {
          throw new Error(`Invalid reply author for ${reply.id}`);
        }

        return {
          ...mapped,
          author: mapped.author
        };
      })
    };
  },

  async createTopic(input: CreateTopicInput & { authorId: string }): Promise<TopicListItem> {
    const topic = await prisma.topic.create({
      data: {
        title: input.title,
        type: input.type,
        body: input.body,
        paperTitle: input.paperTitle || null,
        paperUrl: input.paperUrl || null,
        authorId: input.authorId,
        primaryDisciplineId: input.primaryDisciplineId,
        tags: {
          create: input.tagIds.map((tagId) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        },
        aiGuide: {
          create: {
            content: "",
            model: "pending",
            status: "PENDING"
          }
        }
      },
      include: includeTopicRelations()
    });

    return toTopicListItem(topic as TopicWithRelations);
  },

  async deleteTopic(topicId: string, userId: string): Promise<boolean> {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { authorId: true, status: true }
    });

    if (!topic || topic.status !== "PUBLISHED") {
      return false;
    }

    if (topic.authorId !== userId) {
      throw new Error("FORBIDDEN");
    }

    await prisma.topic.update({
      where: { id: topicId },
      data: { status: "HIDDEN" }
    });

    return true;
  },

  async createReply(input: CreateReplyInput): Promise<Reply & { author: PublicUser }> {
    const reply = await prisma.reply.create({
      data: {
        topicId: input.topicId,
        authorId: input.authorId,
        body: input.body,
        parentReplyId: input.parentReplyId || null
      },
      include: {
        author: true
      }
    });

    await prisma.topic.update({
      where: { id: input.topicId },
      data: { lastActivityAt: new Date() }
    });

    const mapped = toReply(reply);
    if (!mapped.author) {
      throw new Error("Invalid reply author");
    }

    return {
      ...mapped,
      author: mapped.author
    };
  },

  async deleteReply(
    topicId: string,
    replyId: string,
    userId: string
  ): Promise<Reply & { author: PublicUser } | null> {
    const reply = await prisma.reply.findFirst({
      where: { id: replyId, topicId },
      include: {
        author: true
      }
    });

    if (!reply) {
      return null;
    }

    if (reply.authorId !== userId) {
      throw new Error("FORBIDDEN");
    }

    const updated = await prisma.reply.update({
      where: { id: replyId },
      data: { deletedAt: new Date() },
      include: { author: true }
    });

    await prisma.topic.update({
      where: { id: topicId },
      data: { lastActivityAt: new Date() }
    });

    const mapped = toReply(updated);
    if (!mapped.author) {
      throw new Error("Invalid reply author");
    }

    return {
      ...mapped,
      author: mapped.author
    };
  },

  async getAIGuide(topicId: string): Promise<AIGuide | null> {
    const guide = await prisma.aIGuide.findUnique({
      where: { topicId }
    });
    return toAIGuide(guide) ?? null;
  },

  async getAIGuideMeta(topicId: string): Promise<{ repliesSinceGuide: number; isStale: boolean }> {
    const guide = await prisma.aIGuide.findUnique({
      where: { topicId },
      select: {
        status: true,
        updatedAt: true
      }
    });

    if (!guide || guide.status !== "COMPLETED") {
      return {
        repliesSinceGuide: 0,
        isStale: false
      };
    }

    const repliesSinceGuide = await prisma.reply.count({
      where: {
        topicId,
        deletedAt: null,
        createdAt: {
          gt: guide.updatedAt
        }
      }
    });
    const isOlderThanAWeek = Date.now() - guide.updatedAt.getTime() > 7 * 24 * 60 * 60 * 1000;

    return {
      repliesSinceGuide,
      isStale: repliesSinceGuide >= 5 || isOlderThanAWeek
    };
  },

  async upsertAIGuide(topicId: string, content: string, model: string): Promise<AIGuide> {
    const guide = await prisma.aIGuide.upsert({
      where: { topicId },
      update: {
        content,
        model,
        status: "COMPLETED" satisfies AIJobStatus
      },
      create: {
        topicId,
        content,
        model,
        status: "COMPLETED"
      }
    });

    const mapped = toAIGuide(guide);
    if (!mapped) {
      throw new Error("Failed to map AI guide");
    }

    return mapped;
  },

  async markAIGuideFailed(topicId: string): Promise<void> {
    await prisma.aIGuide.upsert({
      where: { topicId },
      update: {
        status: "FAILED" satisfies AIJobStatus
      },
      create: {
        topicId,
        content: "",
        model: "unknown",
        status: "FAILED"
      }
    });
  },

  async ensureTags(names: string[], disciplineId?: string): Promise<Tag[]> {
    const result: Tag[] = [];

    for (const rawName of names) {
      const name = rawName.trim();
      if (!name) {
        continue;
      }

      const existing = await prisma.tag.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive"
          }
        }
      });

      if (existing) {
        result.push(toTag(existing));
        continue;
      }

      const tag = await prisma.tag.create({
        data: {
          name,
          slug: await uniqueTagSlug(name),
          disciplineId: disciplineId || null,
          disciplines: disciplineId
            ? {
                create: {
                  disciplineId
                }
              }
            : undefined
        },
        include: {
          disciplines: true
        }
      });

      result.push(toTag(tag));
    }

    return result;
  }
};
