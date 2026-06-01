export type UserRole = "STUDENT" | "MODERATOR" | "ADMIN";

export type TopicType = "PAPER" | "QUESTION" | "IDEA" | "RECOMMENDATION";

export type TopicStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  school?: string;
  schools?: string[];
  identity?: string;
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
  reviewStatus?: ApprovalStatus;
  createdById?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  disciplineId?: string | null;
  disciplineIds?: string[];
  reviewStatus?: ApprovalStatus;
  reviewReason?: string | null;
  createdById?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  disciplineIds?: string[];
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
  disciplines: Discipline[];
  tags: Tag[];
  replyCount: number;
  aiGuide?: AIGuide;
  aiGuideMeta?: {
    repliesSinceGuide: number;
    isStale: boolean;
  };
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
  disciplineIds: string[];
  tagIds: string[];
};

export type TopicDraftPreference = {
  tagIds: string[];
  disciplineIds: string[];
};

export type NewDisciplineInput = {
  name: string;
  parentId: string;
};

export type NewTagInput = {
  name: string;
  disciplineIds: string[];
  newDisciplines?: NewDisciplineInput[];
  reason?: string;
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

export type AIChatMode = "ask" | "clarify" | "draft";

export type AIChatResponse = {
  message: string;
  mode: AIChatMode;
  referencedReplyNumbers: number[];
  warnings: string[];
};

export type AIPolishResponse = {
  polished: string;
  suggestions: string[];
};
