import Link from "next/link";
import { redirect } from "next/navigation";
import { TopicForm } from "@/components/forms/topic-form";
import { repository } from "@/lib/repository";
import { getCurrentUser } from "@/lib/session";

export default async function NewTopicPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [disciplines, tags] = await Promise.all([
    repository.listDisciplines(),
    repository.listTags()
  ]);

  return (
    <main className="page">
      <section className="section" style={{ marginTop: 12 }}>
        <div className="section-header">
          <div>
            <p className="eyebrow">Create</p>
            <h1 style={{ fontSize: 42, marginBottom: 10 }}>创建 topic</h1>
            <p>清楚地抛出一个论文、问题或直觉，让不同领域的人知道如何加入。</p>
          </div>
          <Link className="button secondary" href="/topics">
            返回列表
          </Link>
        </div>
        <TopicForm disciplines={disciplines} tags={tags} />
      </section>
    </main>
  );
}
