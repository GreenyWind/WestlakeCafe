import Link from "next/link";
import { notFound } from "next/navigation";
import { TopicCard } from "@/components/topic-card";
import { repository } from "@/lib/repository";

type UnclassifiedParams = Promise<{ slug: string }>;

export default async function UnclassifiedDisciplinePage({ params }: { params: UnclassifiedParams }) {
  const { slug } = await params;
  const [discipline, topics] = await Promise.all([
    repository.getDisciplineBySlug(slug),
    repository.listUnclassifiedTopics(slug)
  ]);

  if (!discipline || discipline.parentId) {
    notFound();
  }

  return (
    <main className="page">
      <section className="section" style={{ marginTop: 12 }}>
        <div className="section-header">
          <div>
            <p className="eyebrow">未分类</p>
            <h1 style={{ fontSize: 42, marginBottom: 10 }}>{discipline.name} · 未分类</h1>
            <p>用户新建的子学科。</p>
          </div>
          <Link className="button secondary" href={`/disciplines/${discipline.slug}`}>
            返回
          </Link>
        </div>

        {topics.length > 0 ? (
          <div className="grid grid-2">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="empty">暂时没有未分类 topic。</div>
        )}
      </section>
    </main>
  );
}
