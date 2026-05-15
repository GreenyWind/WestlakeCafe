"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function DeleteTopicButton({ topicId }: { topicId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="stack" style={{ gap: 8 }}>
      <button
        className="button secondary danger"
        disabled={pending}
        type="button"
        onClick={() => {
          const confirmed = window.confirm("确定删除这个 topic 吗？删除后普通列表中不会再显示。");
          if (!confirmed) {
            return;
          }

          setError("");
          startTransition(async () => {
            const response = await fetch(`/api/topics/${topicId}`, { method: "DELETE" });

            if (!response.ok) {
              const data = await response.json().catch(() => null);
              setError(data?.message ?? "删除 topic 失败。");
              return;
            }

            router.push("/topics");
            router.refresh();
          });
        }}
      >
        <Trash2 size={16} aria-hidden="true" />
        {pending ? "删除中" : "删除 topic"}
      </button>
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}
