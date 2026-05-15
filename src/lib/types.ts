export type UserRole = "STUDENT" | "MODERATOR" | "ADMIN";

export type TopicType = "PAPER" | "QUESTION" | "IDEA" | "RECOMMENDATION";

export type TopicStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  school?: string;
  department?: string;
  researchField?: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
};

export type PublicUser = Omit<User, "passwordHash">;

export type Discipline = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  sortOrder: number;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  disciplineId?: string | null;
};

export type Reply = {
  id: string;
  topicId: string;
  authorId: string;
  body: string;
  parentReplyId?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type AIGuide = {
  id: string;
  topicId: string;
  content: string;
  model: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
};

export type Topic = {
  id: string;
  title: string;
  type: TopicType;
  body: string;
  paperTitle?: string;
  paperUrl?: string;
  authorId: string;
  primaryDisciplineId: string;
  status: TopicStatus;
  tagIds: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
};

export type TopicListItem = Topic & {
  author: PublicUser;
  primaryDiscipline: Discipline;
  tags: Tag[];
  replyCount: number;
  aiGuide?: AIGuide;
};

export type TopicDetail = TopicListItem & {
  replies: Array<Reply & { author: PublicUser }>;
};

export type CreateTopicInput = {
  title: string;
  type: TopicType;
  body: string;
  paperTitle?: string;
  paperUrl?: string;
  primaryDisciplineId: string;
  tagIds: string[];
};

export type CreateReplyInput = {
  topicId: string;
  authorId: string;
  body: string;
  parentReplyId?: string;
};

export type AIQuestionResponse = {
  answer: string;
  citations: string[];
};

export type AIConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AIPolishResponse = {
  polished: string;
  suggestions: string[];
};
