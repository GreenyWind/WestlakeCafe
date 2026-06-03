"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function DeleteReplyButton({
  topicId,
  replyId
}: {
  topicId: string;
  replyId: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <span className="stack" style={{ gap: 6 }}>
      <button
        className="button ghost danger small"
        disabled={pending}
        title="删除回复"
        type="button"
        onClick={() => setOpen(true)}
      >
        <Trash2 size={14} aria-hidden="true" />
        删除
      </button>
      {error ? <span className="error">{error}</span> : null}
      {open ? (
        <div className="modal-backdrop">
          <div className="modal-panel compact-modal stack">
            <div>
              <h3>确认删除回复</h3>
              <p className="body-text muted">删除后会保留楼层，并显示“回复已删除”。</p>
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
                    const response = await fetch(`/api/topics/${topicId}/replies/${replyId}`, {
                      method: "DELETE"
                    });

                    if (!response.ok) {
                      const data = await response.json().catch(() => null);
                      setError(data?.message ?? "删除回复失败。");
                      return;
                    }

                    setOpen(false);
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
    </span>
  );
}
