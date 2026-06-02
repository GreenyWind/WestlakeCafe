"use client";

import { Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type ReplyTarget = {
  id: string;
  floor: number;
  authorName: string;
  preview: string;
};

export function ReplyForm({ topicId }: { topicId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [target, setTarget] = useState<ReplyTarget | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    function handleAIDraft(event: Event) {
      const detail = (event as CustomEvent<{ topicId: string; body: string }>).detail;

      if (detail?.topicId === topicId && detail.body) {
        setBody(detail.body);
      }
    }

    window.addEventListener("ai-draft-ready", handleAIDraft);
    return () => window.removeEventListener("ai-draft-ready", handleAIDraft);
  }, [topicId]);

  useEffect(() => {
    function handleReplyTarget(event: Event) {
      const detail = (
        event as CustomEvent<ReplyTarget & { topicId: string }>
      ).detail;

      if (detail?.topicId === topicId && detail.id) {
        setTarget({
          id: detail.id,
          floor: detail.floor,
          authorName: detail.authorName,
          preview: detail.preview
        });
        document.getElementById("reply-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => document.getElementById("reply-body")?.focus(), 250);
      }
    }

    window.addEventListener("reply-target-selected", handleReplyTarget);
    return () => window.removeEventListener("reply-target-selected", handleReplyTarget);
  }, [topicId]);

  return (
    <form
      id="reply-form"
      className="stack"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");

        const replyBody = body.trim();

        startTransition(async () => {
          const response = await fetch(`/api/topics/${topicId}/replies`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              body: replyBody,
              parentReplyId: target?.id
            })
          });

          if (!response.ok) {
            const data = await response.json().catch(() => null);
            setError(data?.message ?? "回复失败，请确认已登录。");
            return;
          }

          setBody("");
          setTarget(null);
          router.refresh();
        });
      }}
    >
      {error ? <div className="error">{error}</div> : null}
      {target ? (
        <div className="reply-target">
          <div>
            <strong>正在回复 #{target.floor}</strong>
            <span>{target.authorName}：{target.preview}</span>
          </div>
          <button
            className="button ghost small"
            type="button"
            onClick={() => setTarget(null)}
          >
            <X size={14} aria-hidden="true" />
            取消
          </button>
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="reply-body">参与讨论</label>
        <textarea
          className="textarea"
          id="reply-body"
          name="body"
          placeholder="可以先说明自己的背景，再提出一个具体问题或补充视角。"
          required
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </div>
      <button className="button" disabled={pending} type="submit">
        <Send size={16} aria-hidden="true" />
        {pending ? "发布中" : "发布回复"}
      </button>
    </form>
  );
}
