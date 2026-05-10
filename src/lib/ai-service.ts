import { repository } from "@/lib/repository";
import type { AIQuestionResponse, AIPolishResponse, TopicDetail } from "@/lib/types";
import { truncate } from "@/lib/utils";

function topicSnapshot(topic: TopicDetail) {
  const tagText = topic.tags.map((tag) => tag.name).join("、");
  const replies = topic.replies.slice(-3).map((reply) => reply.body);

  return {
    title: topic.title,
    discipline: topic.primaryDiscipline.name,
    tags: tagText || "暂无 tag",
    body: truncate(topic.body, 260),
    replies
  };
}

export const aiService = {
  async generateTopicGuide(topicId: string) {
    const topic = await repository.getTopicDetail(topicId);
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    const snapshot = topicSnapshot(topic);
    const content = [
      `这个 topic 属于${snapshot.discipline}，相关 tag 包括：${snapshot.tags}。`,
      `外领域读者可以先抓住讨论主线：${snapshot.body}`,
      "建议从三个角度参与：它试图解决什么问题、使用了哪些关键概念、哪些假设可能需要其他领域的人来质疑。",
      "当前 AI 导读为 mock 版本，后续可以替换为真实模型并加入论文 PDF 解析和引用溯源。"
    ].join("\n\n");

    return repository.upsertAIGuide(topicId, content, "mock-guide-v1");
  },

  async answerQuestion(topicId: string, question: string): Promise<AIQuestionResponse> {
    const topic = await repository.getTopicDetail(topicId);
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    const snapshot = topicSnapshot(topic);

    return {
      answer: [
        `我会先基于当前 topic 来回答。这个讨论的核心是「${snapshot.title}」。`,
        `你的问题是：「${question}」`,
        `一个低门槛切入方式是：先把它放回 ${snapshot.discipline} 的语境中，看作者/发帖人真正关心的是机制、方法、评价指标还是应用边界。`,
        "如果你来自外领域，可以继续追问：这里的关键术语是什么意思、它和我熟悉的方法有什么相似/不同、这个结论依赖哪些假设。"
      ].join("\n\n"),
      citations: ["topic.body", "topic.aiGuide", "topic.recentReplies"]
    };
  },

  async polishReply(topicId: string, input: string): Promise<AIPolishResponse> {
    const topic = await repository.getTopicDetail(topicId);
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    return {
      polished: [
        `我有一个可能的外领域视角，想先确认自己的理解是否准确。`,
        `针对「${topic.title}」，我目前的直觉是：${input}`,
        "如果这个理解成立，或许可以进一步讨论它依赖的前提、可能失效的场景，以及是否有更直接的实验或数据能够区分不同解释。"
      ].join("\n\n"),
      suggestions: [
        "先说明自己的学科背景，降低误解成本。",
        "把直觉改写成可回应的问题。",
        "避免直接评价论文质量，优先指出想确认的假设。"
      ]
    };
  }
};
