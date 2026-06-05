import Link from "next/link";
import { ArrowRight, Bot, Compass, MessagesSquare } from "lucide-react";
import { RecommendationDeck } from "@/components/recommendation-deck";
import { repository } from "@/lib/repository";
import { getCurrentUser } from "@/lib/session";

export default async function HomePage() {
  const user = await getCurrentUser();
  const [disciplines, recommendedTopics] = await Promise.all([
    repository.listDisciplines(),
    repository.getDailyRecommendations(user)
  ]);

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">校内跨领域学术讨论</p>
          <h1>WestlakeCafe</h1>
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
              <span>导读、问答和发言整理帮助外领域读者进入讨论。</span>
            </div>
          </div>
          <div className="signal-row">
            <MessagesSquare size={22} aria-hidden="true" />
            <div>
              <strong>今日跨界探索</strong>
              <br />
              <span>每日生成一组推荐，用滑动方式遇见熟悉和陌生 topic。</span>
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
            <h2>今日跨界探索</h2>
            <p>滚动卡片，在熟悉入口、相邻领域和跨界探索之间切换。</p>
          </div>
          <Link className="button secondary" href="/topics">
            查看全部
          </Link>
        </div>
        <RecommendationDeck topics={recommendedTopics} />
      </section>
    </main>
  );
}
