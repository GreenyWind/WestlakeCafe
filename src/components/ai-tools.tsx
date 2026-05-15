"use client";

import { Bot, FileText, MessageCircle, Send, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { AIConversationMessage } from "@/lib/types";

export function AITools({
  topicId,
  initialGuide
}: {
  topicId: string;
  initialGuide?: string;
}) {
  const router = useRouter();
  const [guide, setGuide] = useState(initialGuide ?? "");
  const [question, setQuestion] = useState("");
  const [questionMessages, setQuestionMessages] = useState<AIConversationMessage[]>([]);
  const [draftInput, setDraftInput] = useState("");
  const [draftMessages, setDraftMessages] = useState<AIConversationMessage[]>([]);
  const [finalDraft, setFinalDraft] = useState("");
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<"guide" | "question" | "clarify" | "draft" | null>(null);
  const [isPending, startTransition] = useTransition();
  const pending = isPending || Boolean(pendingAction);

  async function post(path: string, body: unknown) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message ?? "AI 工具暂时不可用。");
    }

    return response.json();
  }

  function runAI<T>(action: NonNullable<typeof pendingAction>, task: () => Promise<T>) {
    setError("");
    setPendingAction(action);
    startTransition(async () => {
      try {
        await task();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "AI 工具暂时不可用。");
      } finally {
        setPendingAction(null);
      }
    });
  }

  function askQuestion() {
    const trimmed = question.trim();

    if (!trimmed) {
      return;
    }

    const history = questionMessages;
    setQuestion("");
    setQuestionMessages([...history, { role: "user", content: trimmed }]);

    runAI("question", async () => {
      const data = await post(`/api/ai/topics/${topicId}/question`, {
        question: trimmed,
        messages: history
      });
      setQuestionMessages([...history, { role: "user", content: trimmed }, { role: "assistant", content: data.answer }]);
    });
  }

  function discussDraft(mode: "clarify" | "draft") {
    const trimmed = draftInput.trim();

    if (!trimmed && !draftMessages.length) {
      return;
    }

    const latestInput = trimmed || "请根据前面的讨论生成可发布回复。";
    const history = draftMessages;
    const nextUserMessage = trimmed ? { role: "user" as const, content: trimmed } : null;

    if (nextUserMessage) {
      setDraftMessages([...history, nextUserMessage]);
      setDraftInput("");
    }

    runAI(mode, async () => {
      const data = await post(`/api/ai/topics/${topicId}/polish-reply`, {
        input: latestInput,
        messages: history,
        mode
      });
      const nextMessages = [
        ...history,
        ...(nextUserMessage ? [nextUserMessage] : []),
        { role: "assistant" as const, content: data.polished }
      ];
      setDraftMessages(nextMessages);

      if (mode === "draft") {
        setFinalDraft(data.polished);
      }
    });
  }

  function applyDraftToReply() {
    if (!finalDraft) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("ai-draft-ready", {
        detail: {
          topicId,
          body: finalDraft
        }
      })
    );
  }

  return (
    <div className="stack">
      <section className="ai-box stack">
        <h3>
          <FileText size={18} aria-hidden="true" />
          AI 摘要导读
        </h3>
        <p className="body-text">{guide || "这个 topic 还没有摘要导读。可以点击生成，结果会保存到数据库。"}</p>
        <button
          className="button secondary"
          disabled={pending}
          type="button"
          onClick={() => {
            runAI("guide", async () => {
              const data = await post(`/api/ai/topics/${topicId}/guide`, {});
              setGuide(data.content);
              router.refresh();
            });
          }}
        >
          <Wand2 size={16} aria-hidden="true" />
          {pendingAction === "guide" ? "生成中" : guide ? "刷新摘要" : "生成摘要"}
        </button>
      </section>

      <section className="panel stack">
        <h3>
          <MessageCircle size={18} aria-hidden="true" />
          随时问 AI
        </h3>
        {questionMessages.length ? (
          <div className="ai-thread">
            {questionMessages.map((message, index) => (
              <div className={`ai-message ${message.role}`} key={`${message.role}-${index}`}>
                <span>{message.role === "user" ? "你" : "AI"}</span>
                <p className="body-text">{message.content}</p>
              </div>
            ))}
          </div>
        ) : null}
        <textarea
          className="textarea compact"
          value={question}
          placeholder="哪里看不懂，或者想让 AI 解释某个概念，都可以直接问。"
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button className="button" disabled={pending || !question.trim()} type="button" onClick={askQuestion}>
          <Bot size={16} aria-hidden="true" />
          {pendingAction === "question" ? "回答中" : "提问"}
        </button>
      </section>

      <section className="panel stack">
        <h3>
          <Wand2 size={18} aria-hidden="true" />
          讨论并形成回复
        </h3>
        {draftMessages.length ? (
          <div className="ai-thread">
            {draftMessages.map((message, index) => (
              <div className={`ai-message ${message.role}`} key={`${message.role}-${index}`}>
                <span>{message.role === "user" ? "你" : "AI"}</span>
                <p className="body-text">{message.content}</p>
              </div>
            ))}
          </div>
        ) : null}
        <textarea
          className="textarea compact"
          value={draftInput}
          placeholder="先写下你的模糊直觉、疑问或想回应的点。AI 会先帮你澄清，再生成回复。"
          onChange={(event) => setDraftInput(event.target.value)}
        />
        <div className="button-row">
          <button
            className="button secondary"
            disabled={pending || !draftInput.trim()}
            type="button"
            onClick={() => discussDraft("clarify")}
          >
            <MessageCircle size={16} aria-hidden="true" />
            {pendingAction === "clarify" ? "澄清中" : "先讨论澄清"}
          </button>
          <button
            className="button"
            disabled={pending || (!draftInput.trim() && !draftMessages.length)}
            type="button"
            onClick={() => discussDraft("draft")}
          >
            <Wand2 size={16} aria-hidden="true" />
            {pendingAction === "draft" ? "成稿中" : "生成回复"}
          </button>
        </div>
        {finalDraft ? (
          <button className="button secondary" disabled={pending} type="button" onClick={applyDraftToReply}>
            <Send size={16} aria-hidden="true" />
            填入回复框
          </button>
        ) : null}
      </section>
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}
