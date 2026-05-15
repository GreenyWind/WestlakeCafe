import Link from "next/link";
import { notFound } from "next/navigation";
import { TopicCard } from "@/components/topic-card";
import { repository } from "@/lib/repository";

type DisciplineParams = Promise<{ slug: string }>;

export default async function DisciplinePage({ params }: { params: DisciplineParams }) {
  const { slug } = await params;
  const [discipline, disciplines] = await Promise.all([
    repository.getDisciplineBySlug(slug),
    repository.listDisciplines()
  ]);

  if (!discipline) {
    notFound();
  }

  const children =
    disciplines.find((item) => item.id === discipline.id)?.children ??
    disciplines.flatMap((item) => item.children).filter((item) => item.parentId === discipline.id);
  const isRoot = !discipline.parentId;
  const [topics, unclassifiedCount] = await Promise.all([
    isRoot ? Promise.resolve([]) : repository.listTopics({ disciplineSlug: slug }),
    isRoot ? repository.countUnclassifiedTopics(slug) : Promise.resolve(0)
  ]);

  return (
    <main className="page">
      <section className="section" style={{ marginTop: 12 }}>
        <p className="eyebrow">Discipline</p>
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>{discipline.name}</h1>
        <p className="lead">
          {isRoot ? "先选择更具体的子学科，再进入 topic。" : "从这个学科入口进入相关 topic。"}
        </p>

        {isRoot ? (
          <div className="section">
            <div className="section-header">
              <h2>子学科</h2>
            </div>
            <div className="grid grid-3">
              {children.map((child) => (
                <Link className="discipline-card" href={`/disciplines/${child.slug}`} key={child.id}>
                  <h3>{child.name}</h3>
                  <p className="muted">查看 {child.name} 相关讨论。</p>
                </Link>
              ))}
              <Link className="discipline-card" href={`/disciplines/${discipline.slug}/unclassified`}>
                <h3>未分类</h3>
                <p className="muted">
                  查看用户新建、尚未审核进正式学科树的讨论。{unclassifiedCount ? `当前有 ${unclassifiedCount} 个。` : ""}
                </p>
              </Link>
            </div>
          </div>
        ) : null}

        {!isRoot ? (
          <div className="section">
            <div className="section-header">
              <div>
                <h2>相关 topics</h2>
                <p>{topics.length} 个讨论正在或曾经发生。</p>
              </div>
              <Link className="button secondary" href={`/topics?discipline=${discipline.slug}`}>
                在列表中筛选
              </Link>
            </div>
            {topics.length > 0 ? (
              <div className="grid grid-2">
                {topics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            ) : (
              <div className="empty">这个分类下还没有 topic。</div>
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}
