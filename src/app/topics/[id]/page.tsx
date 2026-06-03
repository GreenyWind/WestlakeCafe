import Link from "next/link";
import { ExternalLink, MessageSquare } from "lucide-react";
import { notFound } from "next/navigation";
import { AITools } from "@/components/ai-tools";
import { DeleteReplyButton } from "@/components/delete-reply-button";
import { DeleteTopicButton } from "@/components/delete-topic-button";
import { EditTopicButton } from "@/components/edit-topic-button";
import { ReplyForm } from "@/components/forms/reply-form";
import { ReplyTargetButton } from "@/components/reply-target-button";
import { repository } from "@/lib/repository";
import { getCurrentUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

type TopicParams = Promise<{ id: string }>;

const typeText = {
  PAPER: "论文讨论",
  QUESTION: "问题",
  IDEA: "想法",
  RECOMMENDATION: "求推荐"
} as const;

export default async function TopicDetailPage({ params }: { params: TopicParams }) {
  const { id } = await params;
  const [topic, user] = await Promise.all([repository.getTopicDetail(id), getCurrentUser()]);

  if (!topic) {
    notFound();
  }

  const canDeleteTopic = user && user.id === topic.authorId;
  const replyFloorById = new Map(topic.replies.map((reply, index) => [reply.id, index + 1]));
  const replyById = new Map(topic.replies.map((reply) => [reply.id, reply]));
  const childRepliesByParentId = new Map<string, typeof topic.replies>();

  topic.replies.forEach((reply) => {
    if (!reply.parentReplyId) {
      return;
    }

    const siblings = childRepliesByParentId.get(reply.parentReplyId) ?? [];
    siblings.push(reply);
    childRepliesByParentId.set(reply.parentReplyId, siblings);
  });

  const hotReplyTargets = Array.from(childRepliesByParentId.entries())
    .map(([replyId, children]) => ({
      replyId,
      floor: replyFloorById.get(replyId) ?? 0,
      reply: replyById.get(replyId),
      count: children.filter((reply) => !reply.deletedAt).length,
      latestChildAt: children
        .filter((reply) => !reply.deletedAt)
        .reduce((latest, reply) => Math.max(latest, new Date(reply.createdAt).getTime()), 0)
    }))
    .filter((item) => item.floor > 0 && item.count > 0 && item.reply && !item.reply.deletedAt)
    .sort((a, b) => b.count - a.count || b.latestChildAt - a.latestChildAt || a.floor - b.floor)
    .slice(0, 3);

  return (
    <main className="page">
      <div className="layout-2">
        <article className="panel stack">
          <header className="topic-detail-header">
            <div className="topic-meta">
              <span className="type-badge">{typeText[topic.type]}</span>
              {topic.disciplines.map((discipline) => (
                <Link href={`/disciplines/${discipline.slug}`} key={discipline.id}>
                  {discipline.name}
                  {discipline.reviewStatus === "PENDING" ? "（未分类）" : ""}
                </Link>
              ))}
              <span>{formatDate(topic.createdAt)}</span>
              <span>{topic.viewCount} 次浏览</span>
            </div>
            <h1 className="topic-detail-title">{topic.title}</h1>
            <div className="topic-meta">
              <span>由 {topic.author.name} 发起</span>
              {topic.author.department ? <span>{topic.author.department}</span> : null}
              {topic.author.researchField ? <span>{topic.author.researchField}</span> : null}
            </div>
            <div className="topic-tags">
              {topic.tags.map((tag) => (
                <Link className="tag" href={`/topics?tag=${tag.slug}`} key={tag.id}>
                  {tag.name}
                  {tag.reviewStatus === "PENDING" ? <span>未审核</span> : null}
                </Link>
              ))}
            </div>
          </header>

          {topic.paperTitle || topic.paperUrl ? (
            <section className="ai-box">
              <h3>论文信息</h3>
              {topic.paperTitle ? <p className="body-text">{topic.paperTitle}</p> : null}
              {topic.paperUrl ? (
                <Link className="button secondary" href={topic.paperUrl} target="_blank">
                  打开论文链接
                  <ExternalLink size={16} aria-hidden="true" />
                </Link>
              ) : null}
            </section>
          ) : null}

          <section>
            <h2>主题正文</h2>
            <p className="body-text">{topic.body}</p>
            {canDeleteTopic ? (
              <div className="topic-main-actions">
                <EditTopicButton topic={topic} />
                <DeleteTopicButton topicId={topic.id} />
              </div>
            ) : null}
          </section>

          <section className="stack">
            <h2>
              <MessageSquare size={20} aria-hidden="true" /> 讨论回复
            </h2>
            {hotReplyTargets.length > 0 ? (
              <div className="reply-focus-nav">
                <strong>讨论焦点</strong>
                <div className="topic-tags">
                  {hotReplyTargets.map((item) => (
                    <a className="chip chip-button" href={`#reply-${item.floor}`} key={item.replyId}>
                      #{item.floor} 被回复 {item.count} 次
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
            {topic.replies.length > 0 ? (
              topic.replies.map((reply, index) => {
                const floor = index + 1;
                const isDeleted = Boolean(reply.deletedAt);
                const parentReply = reply.parentReplyId ? replyById.get(reply.parentReplyId) : null;
                const parentFloor = reply.parentReplyId ? replyFloorById.get(reply.parentReplyId) : null;
                const childReplies = (childRepliesByParentId.get(reply.id) ?? []).filter((child) => !child.deletedAt);
                const canDeleteReply =
                  user &&
                  !isDeleted &&
                  user.id === reply.authorId;

                return (
                  <article className="reply" id={`reply-${floor}`} key={reply.id}>
                    <div className="reply-header">
                      <span>
                        #{floor}
                        {isDeleted
                          ? " · 回复已删除"
                          : ` · ${reply.author.name}${
                              reply.author.department ? ` · ${reply.author.department}` : ""
                            }`}
                      </span>
                      <span className="topic-meta">
                        <span>{formatDate(reply.createdAt)}</span>
                        {canDeleteReply ? (
                          <DeleteReplyButton topicId={topic.id} replyId={reply.id} />
                        ) : null}
                      </span>
                    </div>
                    {!isDeleted && parentReply && parentFloor ? (
                      <a className="reply-reference" href={`#reply-${parentFloor}`}>
                        回复 #{parentFloor} · {parentReply.deletedAt ? "原回复已删除" : `${parentReply.author.name}：${parentReply.body.slice(0, 72)}`}
                      </a>
                    ) : null}
                    {isDeleted ? (
                      <p className="body-text muted">回复已删除</p>
                    ) : (
                      <>
                        <p className="body-text">{reply.body}</p>
                        <div className="reply-actions">
                          <ReplyTargetButton
                            topicId={topic.id}
                            replyId={reply.id}
                            floor={floor}
                            authorName={reply.author.name}
                            preview={reply.body.slice(0, 90)}
                          />
                        </div>
                      </>
                    )}
                    {childReplies.length > 0 ? (
                      <div className="reply-backlinks">
                        <span>被回复：</span>
                        {childReplies.map((child) => {
                          const childFloor = replyFloorById.get(child.id);

                          if (!childFloor) {
                            return null;
                          }

                          return (
                            <a href={`#reply-${childFloor}`} key={child.id}>
                              #{childFloor}
                            </a>
                          );
                        })}
                      </div>
                    ) : null}
                  </article>
                );
              })
            ) : (
              <div className="empty">还没有回复，适合做第一个提问的人。</div>
            )}
          </section>

          <section className="panel stack" style={{ boxShadow: "none" }}>
            {user ? (
              <ReplyForm topicId={topic.id} />
            ) : (
              <div className="empty">
                登录后可以回复。
                <br />
                <Link
                  className="button"
                  href={`/login?next=${encodeURIComponent(`/topics/${topic.id}`)}`}
                  style={{ marginTop: 12 }}
                >
                  去登录
                </Link>
              </div>
            )}
          </section>
        </article>

        <aside className="stack">
          <AITools
            topicId={topic.id}
            initialGuide={topic.aiGuide?.content}
            initialGuideStatus={topic.aiGuide?.status}
            canGenerateGuide={Boolean(canDeleteTopic)}
          />
        </aside>
      </div>
    </main>
  );
}
