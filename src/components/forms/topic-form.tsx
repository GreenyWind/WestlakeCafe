"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { Discipline, Tag, TopicType } from "@/lib/types";

type DisciplineTree = Discipline & { children: Discipline[] };

export function TopicForm({
  disciplines,
  tags
}: {
  disciplines: DisciplineTree[];
  tags: Tag[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const leafDisciplines = useMemo(
    () => disciplines.flatMap((discipline) => discipline.children),
    [disciplines]
  );

  return (
    <form
      className="form-panel stack"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const form = new FormData(event.currentTarget);
        const selectedTags = form.getAll("tagIds").map(String);
        const primaryDisciplineId = String(form.get("primaryDisciplineId") ?? "");
        const newTags = String(form.get("newTags") ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        const selectedDiscipline = leafDisciplines.find((discipline) => discipline.id === primaryDisciplineId);
        const allTagIds = new Set(selectedTags);

        if (!primaryDisciplineId) {
          setError("请选择 topic 所属主学科。");
          return;
        }

        if (selectedDiscipline) {
          tags
            .filter((tag) => (tag.disciplineIds ?? (tag.disciplineId ? [tag.disciplineId] : [])).includes(selectedDiscipline.id))
            .forEach((tag) => allTagIds.add(tag.id));
        }

        startTransition(async () => {
          const response = await fetch("/api/topics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: form.get("title"),
              type: form.get("type") as TopicType,
              body: form.get("body"),
              paperTitle: form.get("paperTitle"),
              paperUrl: form.get("paperUrl"),
              primaryDisciplineId,
              tagIds: Array.from(allTagIds),
              newTags
            })
          });

          if (!response.ok) {
            const data = await response.json().catch(() => null);
            setError(data?.message ?? "创建 topic 失败。");
            return;
          }

          const topic = await response.json();
          router.push(`/topics/${topic.id}`);
          router.refresh();
        });
      }}
    >
      {error ? <div className="error">{error}</div> : null}
      <div className="field">
        <label htmlFor="title">讨论主题</label>
        <input
          className="input"
          id="title"
          name="title"
          placeholder="例如：这篇论文的外部验证为什么这么难？"
          required
        />
      </div>
      <div className="grid grid-2">
        <div className="field">
          <label htmlFor="type">topic 类型</label>
          <select className="select" id="type" name="type" defaultValue="QUESTION">
            <option value="PAPER">论文讨论</option>
            <option value="QUESTION">问题</option>
            <option value="IDEA">想法</option>
            <option value="RECOMMENDATION">求推荐</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="primaryDisciplineId">主学科</label>
          <select className="select" id="primaryDisciplineId" name="primaryDisciplineId" required>
            {leafDisciplines.map((discipline) => (
              <option key={discipline.id} value={discipline.id}>
                {discipline.name}
              </option>
            ))}
          </select>
          <p className="field-help">topic 出现在哪个学科分类下，由这里选择的主学科和 tag 决定，不按发帖人的学院归类。</p>
        </div>
      </div>
      <div className="field">
        <label htmlFor="body">正文</label>
        <textarea
          className="textarea"
          id="body"
          name="body"
          placeholder="写清楚你读到了什么、想问什么、希望哪些领域的人参与。"
          required
        />
      </div>
      <div className="grid grid-2">
        <div className="field">
          <label htmlFor="paperTitle">论文标题，可选</label>
          <input className="input" id="paperTitle" name="paperTitle" />
        </div>
        <div className="field">
          <label htmlFor="paperUrl">论文链接，可选</label>
          <input className="input" id="paperUrl" name="paperUrl" type="url" />
        </div>
      </div>
      <div className="field">
        <label>已有 tag，可多选</label>
        <div className="topic-tags">
          {tags.map((tag) => (
            <label className="chip" key={tag.id}>
              <input name="tagIds" type="checkbox" value={tag.id} /> {tag.name}
            </label>
          ))}
        </div>
      </div>
      <div className="field">
        <label htmlFor="newTags">新增 tag，用英文逗号分隔</label>
        <input className="input" id="newTags" name="newTags" placeholder="例如：causal inference, 单细胞" />
      </div>
      <button className="button" disabled={pending} type="submit">
        {pending ? "创建中" : "发布 topic"}
      </button>
    </form>
  );
}
