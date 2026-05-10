import {
  aiGuides,
  disciplines,
  replies,
  tags,
  topics,
  users
} from "@/lib/mock-data";
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

const publicUser = (user: User): PublicUser => {
  const { passwordHash, ...rest } = user;
  return rest;
};

const bySortOrder = (a: Discipline, b: Discipline) => a.sortOrder - b.sortOrder;

function getTopicRelations(topic: Topic): TopicListItem {
  const author = users.find((user) => user.id === topic.authorId);
  const primaryDiscipline = disciplines.find(
    (discipline) => discipline.id === topic.primaryDisciplineId
  );

  if (!author || !primaryDiscipline) {
    throw new Error(`Invalid topic relations for ${topic.id}`);
  }

  return {
    ...topic,
    author: publicUser(author),
    primaryDiscipline,
    tags: tags.filter((tag) => topic.tagIds.includes(tag.id)),
    replyCount: replies.filter((reply) => reply.topicId === topic.id).length,
    aiGuide: aiGuides.find((guide) => guide.topicId === topic.id)
  };
}

function getDescendantDisciplineIds(disciplineId: string) {
  const result = new Set<string>([disciplineId]);
  let changed = true;

  while (changed) {
    changed = false;
    disciplines.forEach((discipline) => {
      if (discipline.parentId && result.has(discipline.parentId) && !result.has(discipline.id)) {
        result.add(discipline.id);
        changed = true;
      }
    });
  }

  return result;
}

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const repository = {
  async getPublicUser(userId: string): Promise<PublicUser | null> {
    const user = users.find((item) => item.id === userId);
    return user ? publicUser(user) : null;
  },

  async findUserByEmail(email: string): Promise<User | null> {
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
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

    const user: User = {
      id: id("user"),
      name: input.name,
      email: input.email,
      passwordHash: input.password,
      school: "示例大学",
      department: input.department,
      researchField: input.researchField,
      role: "STUDENT",
      createdAt: new Date().toISOString()
    };

    users.push(user);
    return publicUser(user);
  },

  async validateLogin(email: string, password: string): Promise<PublicUser | null> {
    const user = await this.findUserByEmail(email);
    if (!user || user.passwordHash !== password) {
      return null;
    }

    return publicUser(user);
  },

  async listDisciplines(): Promise<Array<Discipline & { children: Discipline[] }>> {
    return disciplines
      .filter((discipline) => !discipline.parentId)
      .sort(bySortOrder)
      .map((discipline) => ({
        ...discipline,
        children: disciplines
          .filter((child) => child.parentId === discipline.id)
          .sort(bySortOrder)
      }));
  },

  async getDisciplineBySlug(slug: string): Promise<Discipline | null> {
    return disciplines.find((discipline) => discipline.slug === slug) ?? null;
  },

  async listTags(): Promise<Tag[]> {
    return [...tags].sort((a, b) => a.name.localeCompare(b.name));
  },

  async listTopics(query: TopicQuery = {}): Promise<TopicListItem[]> {
    let result = topics.filter((topic) => topic.status === "PUBLISHED");

    if (query.disciplineSlug) {
      const discipline = disciplines.find((item) => item.slug === query.disciplineSlug);
      if (discipline) {
        const ids = getDescendantDisciplineIds(discipline.id);
        result = result.filter((topic) => ids.has(topic.primaryDisciplineId));
      }
    }

    if (query.tagSlug) {
      const tag = tags.find((item) => item.slug === query.tagSlug);
      if (tag) {
        result = result.filter((topic) => topic.tagIds.includes(tag.id));
      }
    }

    if (query.q) {
      const normalized = query.q.toLowerCase();
      result = result.filter(
        (topic) =>
          topic.title.toLowerCase().includes(normalized) ||
          topic.body.toLowerCase().includes(normalized) ||
          topic.paperTitle?.toLowerCase().includes(normalized)
      );
    }

    const related = result.map(getTopicRelations);

    if (query.sort === "popular") {
      return related.sort((a, b) => b.viewCount - a.viewCount);
    }

    if (query.sort === "latest") {
      return related.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return related.sort(
      (a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
    );
  },

  async listRandomTopics(limit = 4): Promise<TopicListItem[]> {
    const shuffled = [...topics]
      .filter((topic) => topic.status === "PUBLISHED")
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
    return shuffled.map(getTopicRelations);
  },

  async getTopicDetail(topicId: string): Promise<TopicDetail | null> {
    const topic = topics.find((item) => item.id === topicId && item.status === "PUBLISHED");
    if (!topic) {
      return null;
    }

    topic.viewCount += 1;

    const topicReplies = replies
      .filter((reply) => reply.topicId === topic.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((reply) => {
        const author = users.find((user) => user.id === reply.authorId);
        if (!author) {
          throw new Error(`Invalid reply author for ${reply.id}`);
        }

        return {
          ...reply,
          author: publicUser(author)
        };
      });

    return {
      ...getTopicRelations(topic),
      replies: topicReplies
    };
  },

  async createTopic(input: CreateTopicInput & { authorId: string }): Promise<TopicListItem> {
    const now = new Date().toISOString();
    const topic: Topic = {
      id: id("topic"),
      title: input.title,
      type: input.type,
      body: input.body,
      paperTitle: input.paperTitle,
      paperUrl: input.paperUrl,
      authorId: input.authorId,
      primaryDisciplineId: input.primaryDisciplineId,
      status: "PUBLISHED",
      tagIds: input.tagIds,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
      lastActivityAt: now
    };

    topics.unshift(topic);
    return getTopicRelations(topic);
  },

  async createReply(input: CreateReplyInput): Promise<Reply & { author: PublicUser }> {
    const now = new Date().toISOString();
    const reply: Reply = {
      id: id("reply"),
      topicId: input.topicId,
      authorId: input.authorId,
      body: input.body,
      parentReplyId: input.parentReplyId,
      createdAt: now,
      updatedAt: now
    };

    replies.push(reply);

    const topic = topics.find((item) => item.id === input.topicId);
    if (topic) {
      topic.lastActivityAt = now;
      topic.updatedAt = now;
    }

    const author = users.find((user) => user.id === reply.authorId);
    if (!author) {
      throw new Error("Invalid reply author");
    }

    return {
      ...reply,
      author: publicUser(author)
    };
  },

  async getAIGuide(topicId: string): Promise<AIGuide | null> {
    return aiGuides.find((guide) => guide.topicId === topicId) ?? null;
  },

  async upsertAIGuide(topicId: string, content: string, model: string): Promise<AIGuide> {
    const now = new Date().toISOString();
    const existing = aiGuides.find((guide) => guide.topicId === topicId);

    if (existing) {
      existing.content = content;
      existing.model = model;
      existing.status = "COMPLETED";
      existing.updatedAt = now;
      return existing;
    }

    const guide: AIGuide = {
      id: id("guide"),
      topicId,
      content,
      model,
      status: "COMPLETED",
      createdAt: now,
      updatedAt: now
    };

    aiGuides.push(guide);
    return guide;
  },

  async ensureTags(names: string[], disciplineId?: string): Promise<Tag[]> {
    const created: Tag[] = [];

    names.forEach((name) => {
      const normalized = name.trim();
      if (!normalized) {
        return;
      }

      const existing = tags.find((tag) => tag.name.toLowerCase() === normalized.toLowerCase());
      if (existing) {
        created.push(existing);
        return;
      }

      const tag: Tag = {
        id: id("tag"),
        name: normalized,
        slug: slugify(normalized) || id("tag-slug"),
        disciplineId
      };

      tags.push(tag);
      created.push(tag);
    });

    return created;
  }
};
