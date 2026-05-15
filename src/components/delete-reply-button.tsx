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
  const [pending, startTransition] = useTransition();

  return (
    <span className="stack" style={{ gap: 6 }}>
      <button
        className="button ghost danger small"
        disabled={pending}
        title="删除回复"
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

            router.refresh();
          });
        }}
      >
        <Trash2 size={14} aria-hidden="true" />
        {pending ? "删除中" : "删除"}
      </button>
      {error ? <span className="error">{error}</span> : null}
    </span>
  );
}
