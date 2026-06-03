"use client";

import { Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { TopicDetail, TopicType } from "@/lib/types";

const typeOptions: Array<{ value: TopicType; label: string }> = [
  { value: "PAPER", label: "论文讨论" },
  { value: "QUESTION", label: "问题" },
  { value: "IDEA", label: "想法" },
  { value: "RECOMMENDATION", label: "求推荐" }
];

export function EditTopicButton({ topic }: { topic: TopicDetail }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="topic-inline-action">
      <button className="button ghost small" type="button" onClick={() => setOpen(true)}>
        <Pencil size={16} aria-hidden="true" />
        编辑主楼
      </button>
      {open ? (
        <div className="modal-backdrop">
          <form
            className="modal-panel stack"
            onSubmit={(event) => {
              event.preventDefault();
              setError("");
              const form = new FormData(event.currentTarget);

              startTransition(async () => {
                const response = await fetch(`/api/topics/${topic.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: form.get("title"),
                    type: form.get("type"),
                    body: form.get("body"),
                    paperTitle: form.get("paperTitle"),
                    paperUrl: form.get("paperUrl")
                  })
                });

                if (!response.ok) {
                  const data = await response.json().catch(() => null);
                  setError(data?.message ?? "编辑 topic 失败。");
                  return;
                }

                setOpen(false);
                router.refresh();
              });
            }}
          >
            <div className="section-header compact">
              <div>
                <h3>编辑主楼</h3>
                <p>保存后 AI 导读会自动重新生成。</p>
              </div>
              <button className="button ghost small" type="button" onClick={() => setOpen(false)}>
                <X size={15} aria-hidden="true" />
              </button>
            </div>
            {error ? <div className="error">{error}</div> : null}
            <div className="field">
              <label htmlFor="edit-topic-title">讨论主题</label>
              <input className="input" defaultValue={topic.title} id="edit-topic-title" name="title" required />
            </div>
            <div className="field">
              <label htmlFor="edit-topic-type">topic 类型</label>
              <select className="select" defaultValue={topic.type} id="edit-topic-type" name="type">
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="edit-topic-body">正文</label>
              <textarea className="textarea" defaultValue={topic.body} id="edit-topic-body" name="body" required />
            </div>
            <div className="grid grid-2">
              <div className="field">
                <label htmlFor="edit-paper-title">论文标题，可选</label>
                <input className="input" defaultValue={topic.paperTitle ?? ""} id="edit-paper-title" name="paperTitle" />
              </div>
              <div className="field">
                <label htmlFor="edit-paper-url">论文链接，可选</label>
                <input className="input" defaultValue={topic.paperUrl ?? ""} id="edit-paper-url" name="paperUrl" type="url" />
              </div>
            </div>
            <div className="button-row">
              <button className="button" disabled={pending} type="submit">
                {pending ? "保存中" : "保存修改"}
              </button>
              <button className="button secondary" disabled={pending} type="button" onClick={() => setOpen(false)}>
                取消
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
