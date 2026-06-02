"use client";

import { Reply } from "lucide-react";

export function ReplyTargetButton({
  topicId,
  replyId,
  floor,
  authorName,
  preview
}: {
  topicId: string;
  replyId: string;
  floor: number;
  authorName: string;
  preview: string;
}) {
  return (
    <button
      className="button ghost small"
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("reply-target-selected", {
            detail: {
              topicId,
              id: replyId,
              floor,
              authorName,
              preview
            }
          })
        );
      }}
    >
      <Reply size={14} aria-hidden="true" />
      回复
    </button>
  );
}
