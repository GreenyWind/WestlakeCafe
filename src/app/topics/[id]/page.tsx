import Link from "next/link";
import { ExternalLink, MessageSquare } from "lucide-react";
import { notFound } from "next/navigation";
import { AITools } from "@/components/ai-tools";
import { ReplyForm } from "@/components/forms/reply-form";
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

  return (
    <main className="page">
      <div className="layout-2">
        <article className="panel stack">
          <header className="topic-detail-header">
            <div className="topic-meta">
              <span className="type-badge">{typeText[topic.type]}</span>
              <Link href={`/disciplines/${topic.primaryDiscipline.slug}`}>
                {topic.primaryDiscipline.name}
              </Link>
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
          </section>

          <section className="stack">
            <h2>
              <MessageSquare size={20} aria-hidden="true" /> 讨论回复
            </h2>
            {topic.replies.length > 0 ? (
              topic.replies.map((reply) => (
                <article className="reply" key={reply.id}>
                  <div className="reply-header">
                    <span>
                      {reply.author.name}
                      {reply.author.department ? ` · ${reply.author.department}` : ""}
                    </span>
                    <span>{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="body-text">{reply.body}</p>
                </article>
              ))
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
                <Link className="button" href="/login" style={{ marginTop: 12 }}>
                  去登录
                </Link>
              </div>
            )}
          </section>
        </article>

        <aside className="stack">
          <AITools topicId={topic.id} initialGuide={topic.aiGuide?.content} />
        </aside>
      </div>
    </main>
  );
}
