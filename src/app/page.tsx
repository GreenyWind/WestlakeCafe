import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
          <p className="eyebrow">你的线上元宇宙</p>
          <h1>WestlakeCafe</h1>
          <p className="lead">
            把想聊的研究带到这里。
          </p>
          <div className="nav-actions hero-actions">
            <Link className="button" href="/topics">
              浏览 topics
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="button secondary" href="/topics/new">
              创建 topic
            </Link>
          </div>
        </div>
        <section className="hero-recommendation">
          <div className="hero-recommendation-heading">
            <p className="eyebrow">今日跨界探索</p>
            <span>滚动切换推荐 topic。</span>
          </div>
          <RecommendationDeck topics={recommendedTopics} variant="hero" />
        </section>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>学院入口</h2>
            <p>进入学院和子学科。</p>
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
    </main>
  );
}
