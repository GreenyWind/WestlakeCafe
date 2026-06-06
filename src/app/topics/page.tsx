import Link from "next/link";
import { Search } from "lucide-react";
import { TopicCard } from "@/components/topic-card";
import { repository } from "@/lib/repository";

type TopicsSearchParams = Promise<{
  discipline?: string;
  tag?: string;
  q?: string;
  sort?: "latest" | "active" | "popular";
}>;

export default async function TopicsPage({
  searchParams
}: {
  searchParams: TopicsSearchParams;
}) {
  const params = await searchParams;
  const [topics, disciplines, tags] = await Promise.all([
    repository.listTopics({
      disciplineSlug: params.discipline,
      tagSlug: params.tag,
      q: params.q,
      sort: params.sort
    }),
    repository.listDisciplines(),
    repository.listTags()
  ]);

  return (
    <main className="page">
      <section className="section" style={{ marginTop: 12 }}>
        <div className="section-header">
          <div>
            <p className="eyebrow">Topics</p>
            <h1 style={{ fontSize: 42, marginBottom: 10 }}>浏览讨论</h1>
            <p>按学科、tag、关键词和活跃度找到可以参与的话题。</p>
          </div>
          <Link className="button" href="/topics/new">
            创建 topic
          </Link>
        </div>

        <form className="filters">
          <div className="field">
            <label htmlFor="q">搜索</label>
            <input
              className="input"
              defaultValue={params.q ?? ""}
              id="q"
              name="q"
              placeholder="论文、问题或概念"
            />
          </div>
          <div className="field">
            <label htmlFor="discipline">学科</label>
            <select
              className="select"
              defaultValue={params.discipline ?? ""}
              id="discipline"
              name="discipline"
            >
              <option value="">全部</option>
              {disciplines.map((root) => (
                <optgroup key={root.id} label={root.name}>
                  {root.children.map((discipline) => (
                    <option key={discipline.id} value={discipline.slug}>
                      {discipline.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sort">排序</label>
            <select className="select" defaultValue={params.sort ?? "active"} id="sort" name="sort">
              <option value="active">最近活跃</option>
              <option value="latest">最新发布</option>
              <option value="popular">最多浏览</option>
            </select>
          </div>
          {params.tag ? <input name="tag" type="hidden" value={params.tag} /> : null}
          <button className="button" type="submit">
            <Search size={16} aria-hidden="true" />
            筛选
          </button>
        </form>

        <details className="tag-filter-panel">
          <summary>按 tag 筛选</summary>
          <div className="topic-tags">
            <Link className="tag" href="/topics">
              全部 tag
            </Link>
            {tags.map((tag) => (
              <Link className="tag" href={`/topics?tag=${tag.slug}`} key={tag.id}>
                {tag.name}
              </Link>
            ))}
          </div>
        </details>

        {topics.length > 0 ? (
          <div className="grid grid-2">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="empty">暂时没有匹配的 topic。</div>
        )}
      </section>
    </main>
  );
}
