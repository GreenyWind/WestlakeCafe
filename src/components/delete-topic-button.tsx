"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function DeleteTopicButton({ topicId }: { topicId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="topic-inline-action">
      <button className="button ghost small danger" disabled={pending} type="button" onClick={() => setOpen(true)}>
        <Trash2 size={16} aria-hidden="true" />
        删除
      </button>
      {error ? <div className="error">{error}</div> : null}
      {open ? (
        <div className="modal-backdrop">
          <div className="modal-panel stack">
            <div className="section-header compact">
              <div>
                <h3>确认删除 topic</h3>
                <p>删除后普通列表中不会再显示，且无法直接恢复。</p>
              </div>
            </div>
            <div className="button-row">
              <button className="button secondary" disabled={pending} type="button" onClick={() => setOpen(false)}>
                取消
              </button>
              <button
                className="button danger"
                disabled={pending}
                type="button"
                onClick={() => {
                  setError("");
                  startTransition(async () => {
                    const response = await fetch(`/api/topics/${topicId}`, { method: "DELETE" });

                    if (!response.ok) {
                      const data = await response.json().catch(() => null);
                      setError(data?.message ?? "删除 topic 失败。");
                      return;
                    }

                    setOpen(false);
                    router.push("/topics");
                    router.refresh();
                  });
                }}
              >
                {pending ? "删除中" : "确认删除"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
