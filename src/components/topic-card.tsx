import Link from "next/link";
import { Eye, MessageSquare, Sparkles } from "lucide-react";
import type { TopicListItem } from "@/lib/types";
import { formatDate, truncate } from "@/lib/utils";

const typeText: Record<TopicListItem["type"], string> = {
  PAPER: "论文讨论",
  QUESTION: "问题",
  IDEA: "想法",
  RECOMMENDATION: "求推荐"
};

export function TopicCard({ topic }: { topic: TopicListItem }) {
  return (
    <article className="topic-card">
      <div className="topic-meta">
        <span className="type-badge">{typeText[topic.type]}</span>
        <span>{topic.disciplines.map((discipline) => discipline.name).join(" / ")}</span>
        <span>{formatDate(topic.lastActivityAt)}</span>
      </div>
      <Link href={`/topics/${topic.id}`}>
        <h3 className="topic-card-title">{topic.title}</h3>
      </Link>
      <p className="topic-card-body">{truncate(topic.body, 150)}</p>
      {topic.aiGuide ? (
        <p className="topic-card-body">
          <Sparkles size={14} aria-hidden="true" /> {truncate(topic.aiGuide.content, 110)}
        </p>
      ) : null}
      <div className="topic-tags">
        {topic.tags.map((tag) => (
          <Link className="tag" key={tag.id} href={`/topics?tag=${tag.slug}`}>
            {tag.name}
            {tag.reviewStatus === "PENDING" ? <span>未审核</span> : null}
          </Link>
        ))}
      </div>
      <div className="topic-meta">
        <span>由 {topic.author.name} 发起</span>
        <span>
          <MessageSquare size={14} aria-hidden="true" /> {topic.replyCount}
        </span>
        <span>
          <Eye size={14} aria-hidden="true" /> {topic.viewCount}
        </span>
      </div>
    </article>
  );
}
