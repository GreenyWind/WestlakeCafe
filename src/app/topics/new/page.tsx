import Link from "next/link";
import { redirect } from "next/navigation";
import { TopicForm } from "@/components/forms/topic-form";
import { repository } from "@/lib/repository";
import { getCurrentUser } from "@/lib/session";

export default async function NewTopicPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/topics/new");
  }

  const [disciplines, tags, preference] = await Promise.all([
    repository.listDisciplines(),
    repository.listTags({ includePending: true, userId: user.id }),
    repository.getTopicDraftPreference(user.id)
  ]);

  return (
    <main className="page">
      <section className="section" style={{ marginTop: 12 }}>
        <div className="section-header">
          <div>
            <p className="eyebrow page-eyebrow">Create</p>
            <h1 className="page-title">创建 topic</h1>
            <p className="page-subtitle">发起一场学术讨论。</p>
          </div>
          <Link className="button secondary" href="/topics">
            返回列表
          </Link>
        </div>
        <TopicForm disciplines={disciplines} tags={tags} initialPreference={preference} />
      </section>
    </main>
  );
}
