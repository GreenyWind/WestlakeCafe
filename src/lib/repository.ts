import type {
  AIJobStatus,
  AIGuide as PrismaAIGuide,
  Discipline as PrismaDiscipline,
  Prisma,
  Reply as PrismaReply,
  TagDiscipline as PrismaTagDiscipline,
  Tag as PrismaTag,
  TopicDiscipline as PrismaTopicDiscipline,
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
  NewDisciplineInput,
  NewTagInput,
  PublicUser,
  Reply,
  Tag,
  Topic,
  TopicDetail,
  TopicDraftPreference,
  TopicListItem,
  TopicSearchSuggestion,
  UpdateTopicMainPostInput,
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
  disciplines: Array<PrismaTopicDiscipline & { discipline: PrismaDiscipline }>;
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
    schools: rest.schools,
    identity: rest.identity ?? undefined,
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
    sortOrder: discipline.sortOrder,
    createdById: discipline.createdById,
    createdAt: toDateString(discipline.createdAt),
    updatedAt: toDateString(discipline.updatedAt)
  };
}

function toTag(tag: PrismaTag & { disciplines?: Array<Pick<PrismaTagDiscipline, "disciplineId">> }): Tag {
  return {
    ...tag,
    disciplineId: tag.disciplineId,
    disciplineIds: tag.disciplines?.map((item) => item.disciplineId) ?? (tag.disciplineId ? [tag.disciplineId] : []),
    reviewReason: tag.reviewReason,
    createdById: tag.createdById,
    createdAt: toDateString(tag.createdAt),
    updatedAt: toDateString(tag.updatedAt)
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

function toTopicBase(
  topic: PrismaTopic & {
    tags?: Array<{ tag: PrismaTag }>;
    disciplines?: Array<Pick<PrismaTopicDiscipline, "disciplineId">>;
  }
): Topic {
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
    disciplineIds: topic.disciplines?.map((item) => item.disciplineId) ?? [topic.primaryDisciplineId],
    tagIds: topic.tags?.map((item) => item.tag.id) ?? [],
    viewCount: topic.viewCount,
    createdAt: toDateString(topic.createdAt),
    updatedAt: toDateString(topic.updatedAt),
    lastActivityAt: toDateString(topic.lastActivityAt)
  };
}

function toTopicListItem(topic: TopicWithRelations): TopicListItem {
  const topicDisciplines =
    topic.disciplines.length > 0
      ? topic.disciplines.map((item) => toDiscipline(item.discipline))
      : [toDiscipline(topic.primaryDiscipline)];

  return {
    ...toTopicBase(topic),
    author: toPublicUser(topic.author),
    primaryDiscipline: toDiscipline(topic.primaryDiscipline),
    disciplines: topicDisciplines,
    tags: topic.tags.map((item) => toTag(item.tag)),
    replyCount: topic._count.replies,
    aiGuide: toAIGuide(topic.aiGuide),
    aiGuideMeta: {
      repliesSinceGuide: 0,
      isStale: false
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
    disciplines: {
      include: {
        discipline: true
      },
      orderBy: {
        discipline: {
          sortOrder: "asc"
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

async function uniqueDisciplineSlug(name: string, parentId?: string | null) {
  const parent = parentId
    ? await prisma.discipline.findUnique({
        where: { id: parentId },
        select: { slug: true }
      })
    : null;
  const base = slugify(parent ? `${parent.slug}-${name}` : name) || `discipline-${Date.now()}`;
  let candidate = base;
  let counter = 2;

  while (await prisma.discipline.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}

function uniqueIds(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
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
    identity?: string;
    schools?: string[];
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
        schools: input.schools ?? [],
        identity: input.identity || null,
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

  async listDisciplines(options: { includePending?: boolean } = {}): Promise<Array<Discipline & { children: Discipline[] }>> {
    const roots = await prisma.discipline.findMany({
      where: {
        parentId: null,
        ...(options.includePending ? {} : { reviewStatus: "APPROVED" })
      },
      orderBy: { sortOrder: "asc" },
      include: {
        children: {
          where: options.includePending ? undefined : { reviewStatus: "APPROVED" },
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

  async listTags(options: { includePending?: boolean; userId?: string } = {}): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      where: options.includePending
        ? options.userId
          ? {
              OR: [{ reviewStatus: "APPROVED" }, { createdById: options.userId }]
            }
          : undefined
        : { reviewStatus: "APPROVED" },
      orderBy: { name: "asc" },
      include: {
        disciplines: true
      }
    });
    return tags.map(toTag);
  },

  async listTopics(query: TopicQuery = {}): Promise<TopicListItem[]> {
    const and: Prisma.TopicWhereInput[] = [{ status: "PUBLISHED" }];

    if (query.disciplineSlug) {
      const discipline = await prisma.discipline.findUnique({
        where: { slug: query.disciplineSlug }
      });

      if (!discipline) {
        return [];
      }

      const disciplineIds = await getDescendantDisciplineIds(discipline.id);

      and.push({
        OR: [
          {
            disciplines: {
              some: {
                disciplineId: {
                  in: disciplineIds
                }
              }
            }
          },
          {
            primaryDisciplineId: {
              in: disciplineIds
            }
          }
        ]
      });
    }

    if (query.tagSlug) {
      and.push({
        tags: {
          some: {
            tag: {
              slug: query.tagSlug
            }
          }
        }
      });
    }

    if (query.q) {
      and.push({
        OR: [
          { title: { contains: query.q, mode: "insensitive" } },
          { body: { contains: query.q, mode: "insensitive" } },
          { paperTitle: { contains: query.q, mode: "insensitive" } },
          {
            tags: {
              some: {
                tag: {
                  name: {
                    contains: query.q,
                    mode: "insensitive"
                  }
                }
              }
            }
          }
        ]
      });
    }

    const where: Prisma.TopicWhereInput = { AND: and };

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

  async searchTopicSuggestions(query: string, limit = 6): Promise<TopicSearchSuggestion[]> {
    const q = query.trim();

    if (q.length < 2) {
      return [];
    }

    const take = Math.min(Math.max(limit, 1), 8);
    const topics = await prisma.topic.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { paperTitle: { contains: q, mode: "insensitive" } },
          {
            tags: {
              some: {
                tag: {
                  name: {
                    contains: q,
                    mode: "insensitive"
                  }
                }
              }
            }
          }
        ]
      },
      orderBy: { lastActivityAt: "desc" },
      take,
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return topics.map((topic) => {
      const tagText = topic.tags.map((item) => item.tag.name).join(" / ");
      const subtitle = topic.paperTitle
        ? `论文：${topic.paperTitle}`
        : tagText
          ? `tag：${tagText}`
          : "topic";

      return {
        id: topic.id,
        title: topic.title,
        subtitle,
        href: `/topics/${topic.id}`
      };
    });
  },

  async listUnclassifiedTopics(parentDisciplineSlug: string): Promise<TopicListItem[]> {
    const parent = await prisma.discipline.findFirst({
      where: {
        slug: parentDisciplineSlug,
        parentId: null
      }
    });

    if (!parent) {
      return [];
    }

    const topics = await prisma.topic.findMany({
      where: {
        status: "PUBLISHED",
        disciplines: {
          some: {
            discipline: {
              parentId: parent.id,
              reviewStatus: "PENDING"
            }
          }
        }
      },
      orderBy: { lastActivityAt: "desc" },
      include: includeTopicRelations()
    });

    return topics.map((topic) => toTopicListItem(topic as TopicWithRelations));
  },

  async countUnclassifiedTopics(parentDisciplineSlug: string): Promise<number> {
    const parent = await prisma.discipline.findFirst({
      where: {
        slug: parentDisciplineSlug,
        parentId: null
      }
    });

    if (!parent) {
      return 0;
    }

    return prisma.topic.count({
      where: {
        status: "PUBLISHED",
        disciplines: {
          some: {
            discipline: {
              parentId: parent.id,
              reviewStatus: "PENDING"
            }
          }
        }
      }
    });
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
    const disciplineIds = uniqueIds([...input.disciplineIds, input.primaryDisciplineId]);

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
        disciplines: {
          create: disciplineIds.map((disciplineId) => ({ disciplineId }))
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

  async updateTopicMainPost(
    topicId: string,
    userId: string,
    input: UpdateTopicMainPostInput
  ): Promise<TopicListItem | null> {
    const existing = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { authorId: true, status: true }
    });

    if (!existing || existing.status !== "PUBLISHED") {
      return null;
    }

    if (existing.authorId !== userId) {
      throw new Error("FORBIDDEN");
    }

    const topic = await prisma.topic.update({
      where: { id: topicId },
      data: {
        title: input.title,
        type: input.type,
        body: input.body,
        paperTitle: input.paperTitle || null,
        paperUrl: input.paperUrl || null,
        lastActivityAt: new Date()
      },
      include: includeTopicRelations()
    });

    await this.markAIGuidePending(topicId);

    return toTopicListItem(topic as TopicWithRelations);
  },

  async getTopicDraftPreference(userId: string): Promise<TopicDraftPreference> {
    const preference = await prisma.userTopicPreference.findUnique({
      where: { userId }
    });

    return {
      tagIds: preference?.tagIds ?? [],
      disciplineIds: preference?.disciplineIds ?? []
    };
  },

  async saveTopicDraftPreference(input: {
    userId: string;
    tagIds: string[];
    disciplineIds: string[];
  }): Promise<TopicDraftPreference> {
    const tagIds = uniqueIds(input.tagIds);
    const disciplineIds = uniqueIds(input.disciplineIds);

    const preference = await prisma.userTopicPreference.upsert({
      where: { userId: input.userId },
      update: {
        tagIds,
        disciplineIds
      },
      create: {
        userId: input.userId,
        tagIds,
        disciplineIds
      }
    });

    return {
      tagIds: preference.tagIds,
      disciplineIds: preference.disciplineIds
    };
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
    return {
      repliesSinceGuide: 0,
      isStale: false
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

  async markAIGuidePending(topicId: string): Promise<void> {
    await prisma.aIGuide.upsert({
      where: { topicId },
      update: {
        content: "",
        model: "pending",
        status: "PENDING" satisfies AIJobStatus
      },
      create: {
        topicId,
        content: "",
        model: "pending",
        status: "PENDING"
      }
    });
  },

  async ensurePendingDisciplines(input: {
    disciplines: NewDisciplineInput[];
    userId: string;
  }): Promise<Discipline[]> {
    const result: Discipline[] = [];

    for (const item of input.disciplines) {
      const name = item.name.trim();
      const parentId = item.parentId.trim();

      if (!name || !parentId) {
        continue;
      }

      const parent = await prisma.discipline.findFirst({
        where: {
          id: parentId,
          parentId: null,
          reviewStatus: "APPROVED"
        }
      });

      if (!parent) {
        continue;
      }

      const existing = await prisma.discipline.findFirst({
        where: {
          parentId,
          name: {
            equals: name,
            mode: "insensitive"
          }
        }
      });

      if (existing) {
        result.push(toDiscipline(existing));
        continue;
      }

      const discipline = await prisma.discipline.create({
        data: {
          name,
          slug: await uniqueDisciplineSlug(name, parentId),
          parentId,
          reviewStatus: "PENDING",
          createdById: input.userId || null,
          sortOrder: 999
        }
      });

      result.push(toDiscipline(discipline));
    }

    return result;
  },

  async createPendingTags(input: {
    tags: NewTagInput[];
    userId: string;
  }): Promise<Tag[]> {
    const result: Tag[] = [];

    for (const rawTag of input.tags) {
      const name = rawTag.name.trim();
      if (!name) {
        continue;
      }

      const newDisciplines = await this.ensurePendingDisciplines({
        disciplines: rawTag.newDisciplines ?? [],
        userId: input.userId
      });
      const disciplineIds = uniqueIds([
        ...rawTag.disciplineIds,
        ...newDisciplines.map((discipline) => discipline.id)
      ]);

      if (disciplineIds.length === 0) {
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
        const existingWithLinks = await prisma.tag.findUniqueOrThrow({
          where: { id: existing.id },
          include: { disciplines: true }
        });
        result.push(toTag(existingWithLinks));
        continue;
      }

      const tag = await prisma.tag.create({
        data: {
          name,
          slug: await uniqueTagSlug(name),
          disciplineId: disciplineIds[0] ?? null,
          reviewStatus: "PENDING",
          reviewReason: rawTag.reason?.trim() || null,
          createdById: input.userId || null,
          disciplines: {
            create: disciplineIds.map((disciplineId) => ({ disciplineId }))
          }
        },
        include: {
          disciplines: true
        }
      });

      result.push(toTag(tag));
    }

    return result;
  },

  async ensureTags(names: string[], disciplineId?: string): Promise<Tag[]> {
    const newTags = names.map((name) => ({
      name,
      disciplineIds: disciplineId ? [disciplineId] : []
    }));

    return this.createPendingTags({
      tags: newTags,
      userId: ""
    });
  }
};
