import Link from "next/link";
import { notFound } from "next/navigation";
import { TopicCard } from "@/components/topic-card";
import { repository } from "@/lib/repository";

type DisciplineParams = Promise<{ slug: string }>;

export default async function DisciplinePage({ params }: { params: DisciplineParams }) {
  const { slug } = await params;
  const [discipline, disciplines, tags] = await Promise.all([
    repository.getDisciplineBySlug(slug),
    repository.listDisciplines(),
    repository.listTags()
  ]);

  if (!discipline) {
    notFound();
  }

  const children =
    disciplines.find((item) => item.id === discipline.id)?.children ??
    disciplines.flatMap((item) => item.children).filter((item) => item.parentId === discipline.id);
  const isRoot = !discipline.parentId;
  const tagsByDiscipline = new Map<string, typeof tags>();

  for (const tag of tags) {
    for (const disciplineId of tag.disciplineIds ?? []) {
      const current = tagsByDiscipline.get(disciplineId) ?? [];
      current.push(tag);
      tagsByDiscipline.set(disciplineId, current);
    }
  }

  const [topics, unclassifiedCount] = await Promise.all([
    isRoot ? Promise.resolve([]) : repository.listTopics({ disciplineSlug: slug }),
    isRoot ? repository.countUnclassifiedTopics(slug) : Promise.resolve(0)
  ]);

  return (
    <main className="page">
      <section className="section" style={{ marginTop: 12 }}>
        <p className="eyebrow">{isRoot ? "学院" : "子学科"}</p>
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>{discipline.name}</h1>
        <p className="lead">
          {isRoot ? "选择子学科。" : "浏览相关 topic。"}
        </p>

        {isRoot ? (
          <div className="section">
            <div className="section-header">
              <h2>子学科</h2>
            </div>
            <div className="grid grid-3">
              {children.map((child) => {
                const previewTags = (tagsByDiscipline.get(child.id) ?? []).slice(0, 5);

                return (
                  <Link className="discipline-card" href={`/disciplines/${child.slug}`} key={child.id}>
                    <h3>{child.name}</h3>
                    {previewTags.length > 0 ? (
                      <div className="subdiscipline-list">
                        {previewTags.map((tag) => (
                          <span className="chip" key={tag.id}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="muted">暂无 tag</p>
                    )}
                  </Link>
                );
              })}
              <Link className="discipline-card" href={`/disciplines/${discipline.slug}/unclassified`}>
                <h3>未分类</h3>
                <p className="muted">
                  用户新建的子学科。{unclassifiedCount ? `${unclassifiedCount} 个 topic。` : ""}
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
                <p>{topics.length} 个 topic。</p>
              </div>
              <Link className="button secondary" href={`/topics?discipline=${discipline.slug}`}>
                列表视图
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
