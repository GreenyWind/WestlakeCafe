"use client";

import { Bot, FileText, MessageCircle, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

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
  const [answer, setAnswer] = useState("");
  const [draftInput, setDraftInput] = useState("");
  const [draftOutput, setDraftOutput] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

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

  return (
    <div className="stack">
      <section className="ai-box stack">
        <h3>
          <FileText size={18} aria-hidden="true" />
          AI 导读
        </h3>
        <p className="body-text">
          {guide || "这个 topic 还没有导读。可以点击生成 mock 导读，后续接入真实模型。"}
        </p>
        <button
          className="button secondary"
          disabled={pending}
          type="button"
          onClick={() => {
            setError("");
            startTransition(async () => {
              try {
                const data = await post(`/api/ai/topics/${topicId}/guide`, {});
                setGuide(data.content);
                router.refresh();
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : "生成失败。");
              }
            });
          }}
        >
          <Wand2 size={16} aria-hidden="true" />
          {pending ? "处理中" : "生成/刷新导读"}
        </button>
      </section>

      <section className="panel stack">
        <h3>
          <MessageCircle size={18} aria-hidden="true" />
          问 AI
        </h3>
        <textarea
          className="textarea"
          value={question}
          placeholder="问一个外领域读者卡住的问题。"
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button
          className="button"
          disabled={pending || !question.trim()}
          type="button"
          onClick={() => {
            setError("");
            startTransition(async () => {
              try {
                const data = await post(`/api/ai/topics/${topicId}/question`, { question });
                setAnswer(data.answer);
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : "回答失败。");
              }
            });
          }}
        >
          <Bot size={16} aria-hidden="true" />
          提问
        </button>
        {answer ? <div className="success body-text">{answer}</div> : null}
      </section>

      <section className="panel stack">
        <h3>
          <Wand2 size={18} aria-hidden="true" />
          整理发言
        </h3>
        <textarea
          className="textarea"
          value={draftInput}
          placeholder="先随便写下你的直觉，AI 会整理成更适合发出的回复草稿。"
          onChange={(event) => setDraftInput(event.target.value)}
        />
        <button
          className="button"
          disabled={pending || !draftInput.trim()}
          type="button"
          onClick={() => {
            setError("");
            startTransition(async () => {
              try {
                const data = await post(`/api/ai/topics/${topicId}/polish-reply`, {
                  input: draftInput
                });
                setDraftOutput(data.polished);
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : "整理失败。");
              }
            });
          }}
        >
          生成草稿
        </button>
        {draftOutput ? <div className="success body-text">{draftOutput}</div> : null}
      </section>
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}
