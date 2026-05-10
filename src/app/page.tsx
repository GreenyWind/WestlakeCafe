import Link from "next/link";
import { ArrowRight, Bot, Compass, MessagesSquare } from "lucide-react";
import { TopicCard } from "@/components/topic-card";
import { repository } from "@/lib/repository";

export default async function HomePage() {
  const [disciplines, randomTopics] = await Promise.all([
    repository.listDisciplines(),
    repository.listRandomTopics(4)
  ]);

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">校内跨领域学术讨论</p>
          <h1>Campus Topic Lab</h1>
          <p className="lead">
            以 topic 为单位组织论文、问题和研究直觉，让博士生能更低成本地进入陌生领域的讨论。
          </p>
          <div className="nav-actions" style={{ justifyContent: "flex-start", marginTop: 12 }}>
            <Link className="button" href="/topics">
              浏览 topics
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="button secondary" href="/topics/new">
              创建 topic
            </Link>
          </div>
        </div>
        <div className="hero-panel" aria-label="核心能力">
          <div className="signal-row">
            <Compass size={22} aria-hidden="true" />
            <div>
              <strong>按学科进入</strong>
              <br />
              <span>从学院到子学科，再进入具体 topic。</span>
            </div>
          </div>
          <div className="signal-row">
            <Bot size={22} aria-hidden="true" />
            <div>
              <strong>AI 降低门槛</strong>
              <br />
              <span>导读、问答和发言整理先以 mock 接口跑通。</span>
            </div>
          </div>
          <div className="signal-row">
            <MessagesSquare size={22} aria-hidden="true" />
            <div>
              <strong>随机遇见外领域</strong>
              <br />
              <span>首页随机推荐 topic，先实现简单而有效的跨域曝光。</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>学科入口</h2>
            <p>先从熟悉或陌生的学院进入。</p>
          </div>
        </div>
        <div className="grid grid-2">
          {disciplines.map((discipline) => (
            <Link
              className="discipline-card"
              href={`/disciplines/${discipline.slug}`}
              key={discipline.id}
            >
              <div>
                <h3>{discipline.name}</h3>
                <p className="muted">查看该大类下的子学科和相关 topics。</p>
              </div>
              <div className="subdiscipline-list">
                {discipline.children.map((child) => (
                  <span className="chip" key={child.id}>
                    {child.name}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>随机推荐 topic</h2>
            <p>先用随机推荐制造一点跨领域偶遇。</p>
          </div>
          <Link className="button secondary" href="/topics">
            查看全部
          </Link>
        </div>
        <div className="grid grid-2">
          {randomTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
    </main>
  );
}
