"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function ReplyForm({ topicId }: { topicId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="stack"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");

        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const body = String(form.get("body") ?? "");

        startTransition(async () => {
          const response = await fetch(`/api/topics/${topicId}/replies`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body })
          });

          if (!response.ok) {
            const data = await response.json().catch(() => null);
            setError(data?.message ?? "回复失败，请确认已登录。");
            return;
          }

          formElement.reset();
          router.refresh();
        });
      }}
    >
      {error ? <div className="error">{error}</div> : null}
      <div className="field">
        <label htmlFor="reply-body">参与讨论</label>
        <textarea
          className="textarea"
          id="reply-body"
          name="body"
          placeholder="可以先说明自己的背景，再提出一个具体问题或补充视角。"
          required
        />
      </div>
      <button className="button" disabled={pending} type="submit">
        <Send size={16} aria-hidden="true" />
        {pending ? "发布中" : "发布回复"}
      </button>
    </form>
  );
}
