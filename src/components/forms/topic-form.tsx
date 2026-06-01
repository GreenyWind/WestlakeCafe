"use client";

import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { Discipline, NewDisciplineInput, NewTagInput, Tag, TopicDraftPreference, TopicType } from "@/lib/types";

type DisciplineTree = Discipline & { children: Discipline[] };

type DraftTag = {
  id: string;
  name: string;
  disciplineIds: string[];
  newDisciplines: Array<NewDisciplineInput & { id: string }>;
  reason: string;
};

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function makeDraftTag(): DraftTag {
  return {
    id: crypto.randomUUID(),
    name: "",
    disciplineIds: [],
    newDisciplines: [],
    reason: ""
  };
}

function makeDraftDiscipline(parentId = "") {
  return {
    id: crypto.randomUUID(),
    name: "",
    parentId
  };
}

export function TopicForm({
  disciplines,
  tags,
  initialPreference
}: {
  disciplines: DisciplineTree[];
  tags: Tag[];
  initialPreference?: TopicDraftPreference;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const initialTagIds = useMemo(
    () => unique((initialPreference?.tagIds ?? []).filter((id) => tags.some((tag) => tag.id === id))),
    [initialPreference?.tagIds, tags]
  );
  const initialDisciplineIds = useMemo(() => {
    const leafIds = new Set(disciplines.flatMap((discipline) => discipline.children.map((child) => child.id)));
    const restoredDisciplineIds = (initialPreference?.disciplineIds ?? []).filter((id) => leafIds.has(id));
    const restoredTagDisciplineIds = tags
      .filter((tag) => initialTagIds.includes(tag.id))
      .flatMap((tag) => tag.disciplineIds ?? [])
      .filter((id) => leafIds.has(id));

    return unique([...restoredDisciplineIds, ...restoredTagDisciplineIds]);
  }, [disciplines, initialPreference?.disciplineIds, initialTagIds, tags]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);
  const [selectedDisciplineIds, setSelectedDisciplineIds] = useState<string[]>(initialDisciplineIds);
  const [draftTags, setDraftTags] = useState<DraftTag[]>([]);

  const rootDisciplines = disciplines;
  const leafDisciplines = useMemo(
    () => disciplines.flatMap((discipline) => discipline.children),
    [disciplines]
  );
  const disciplineNameById = useMemo(
    () => new Map([...rootDisciplines, ...leafDisciplines].map((discipline) => [discipline.id, discipline.name])),
    [leafDisciplines, rootDisciplines]
  );
  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));
  const visibleSelectedDisciplines = leafDisciplines.filter((discipline) =>
    selectedDisciplineIds.includes(discipline.id)
  );
  const newDisciplines = draftTags.flatMap((tag) => tag.newDisciplines);
  const primaryDisciplineId =
    selectedDisciplineIds[0] ?? newDisciplines[0]?.id ?? leafDisciplines[0]?.id ?? "";

  function toggleTag(tag: Tag, checked: boolean) {
    setSelectedTagIds((current) =>
      checked ? unique([...current, tag.id]) : current.filter((id) => id !== tag.id)
    );

    if (checked) {
      setSelectedDisciplineIds((current) => unique([...current, ...(tag.disciplineIds ?? [])]));
    }
  }

  function toggleDiscipline(id: string, checked: boolean) {
    setSelectedDisciplineIds((current) =>
      checked ? unique([...current, id]) : current.filter((item) => item !== id)
    );
  }

  function updateDraftTag(id: string, patch: Partial<DraftTag>) {
    setDraftTags((current) =>
      current.map((tag) =>
        tag.id === id
          ? {
              ...tag,
              ...patch
            }
          : tag
      )
    );
  }

  function updateDraftDiscipline(tagId: string, disciplineId: string, patch: Partial<NewDisciplineInput>) {
    setDraftTags((current) =>
      current.map((tag) =>
        tag.id === tagId
          ? {
              ...tag,
              newDisciplines: tag.newDisciplines.map((discipline) =>
                discipline.id === disciplineId
                  ? {
                      ...discipline,
                      ...patch
                    }
                  : discipline
              )
            }
          : tag
      )
    );
  }

  return (
    <form
      className="form-panel stack"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const form = new FormData(event.currentTarget);
        const title = String(form.get("title") ?? "").trim();
        const body = String(form.get("body") ?? "").trim();
        const cleanedDraftTags: NewTagInput[] = draftTags
          .map((tag) => ({
            name: tag.name.trim(),
            disciplineIds: tag.disciplineIds,
            newDisciplines: tag.newDisciplines
              .map((discipline) => ({
                name: discipline.name.trim(),
                parentId: discipline.parentId.trim()
              }))
              .filter((discipline) => discipline.name && discipline.parentId),
            reason: tag.reason.trim()
          }))
          .filter((tag) => tag.name && (tag.disciplineIds.length > 0 || (tag.newDisciplines?.length ?? 0) > 0));
        const pendingDisciplineKeys = cleanedDraftTags.flatMap((tag) =>
          (tag.newDisciplines ?? []).map((discipline) => `new:${discipline.parentId}:${discipline.name}`)
        );
        const finalDisciplineIds = unique([...selectedDisciplineIds, ...pendingDisciplineKeys]);

        if (!title || !body || finalDisciplineIds.length === 0 || selectedTagIds.length + cleanedDraftTags.length === 0) {
          setError("请填写标题、正文，并至少选择或新建一个 tag 和学科归属。");
          return;
        }

        startTransition(async () => {
          const response = await fetch("/api/topics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              type: form.get("type") as TopicType,
              body,
              paperTitle: form.get("paperTitle"),
              paperUrl: form.get("paperUrl"),
              primaryDisciplineId,
              disciplineIds: selectedDisciplineIds,
              tagIds: selectedTagIds,
              newTags: cleanedDraftTags
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
          <label>实际展示学科</label>
          <div className="selection-summary">
            {visibleSelectedDisciplines.length > 0 || newDisciplines.length > 0 ? (
              <>
                {visibleSelectedDisciplines.map((discipline) => (
                  <button
                    className="chip chip-button"
                    key={discipline.id}
                    onClick={() => toggleDiscipline(discipline.id, false)}
                    type="button"
                  >
                    {discipline.name}
                    <X size={13} aria-hidden="true" />
                  </button>
                ))}
                {newDisciplines.map((discipline) => (
                  <span className="chip pending-chip" key={discipline.id}>
                    {discipline.name || "新学科"}
                    <span>未审核</span>
                  </span>
                ))}
              </>
            ) : (
              <span className="muted">选择 tag 后会自动带出默认学科，也可以手动增删。</span>
            )}
          </div>
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
        <label>选择已有 tag</label>
        <div className="topic-tags">
          {tags.map((tag) => (
            <label className="chip selectable-chip" key={tag.id}>
              <input
                checked={selectedTagIds.includes(tag.id)}
                onChange={(event) => toggleTag(tag, event.currentTarget.checked)}
                type="checkbox"
              />{" "}
              {tag.name}
            </label>
          ))}
        </div>
        {selectedTags.length > 0 ? (
          <p className="field-help">
            已选 tag 会自动建议学科归属：{" "}
            {unique(selectedTags.flatMap((tag) => tag.disciplineIds ?? []))
              .map((id) => disciplineNameById.get(id))
              .filter(Boolean)
              .join("、")}
            。你可以在下面删掉不适合本 topic 的学科。
          </p>
        ) : null}
      </div>

      <div className="field">
        <label>调整学科归属</label>
        <div className="discipline-picker">
          {rootDisciplines.map((root) => (
            <div className="discipline-picker-group" key={root.id}>
              <strong>{root.name}</strong>
              <div className="topic-tags">
                {root.children.map((discipline) => (
                  <label className="chip selectable-chip" key={discipline.id}>
                    <input
                      checked={selectedDisciplineIds.includes(discipline.id)}
                      onChange={(event) => toggleDiscipline(discipline.id, event.currentTarget.checked)}
                      type="checkbox"
                    />{" "}
                    {discipline.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="nested-panel stack">
        <div className="section-header compact">
          <div>
            <h3>新建 tag</h3>
            <p>找不到合适 tag 时再添加。新建 tag 会标记为未审核，暂时只服务这次发帖和后续管理员整理。</p>
          </div>
          <button className="button secondary small" onClick={() => setDraftTags((current) => [...current, makeDraftTag()])} type="button">
            <Plus size={15} aria-hidden="true" />
            添加
          </button>
        </div>
        {draftTags.length === 0 ? (
          <div className="empty compact-empty">暂时没有新建 tag。</div>
        ) : (
          draftTags.map((tag) => (
            <div className="pending-tag-editor stack" key={tag.id}>
              <div className="section-header compact">
                <strong>未审核 tag</strong>
                <button
                  className="button ghost small"
                  onClick={() => setDraftTags((current) => current.filter((item) => item.id !== tag.id))}
                  type="button"
                >
                  移除
                </button>
              </div>
              <div className="grid grid-2">
                <div className="field">
                  <label>tag 名称</label>
                  <input
                    className="input"
                    onChange={(event) => updateDraftTag(tag.id, { name: event.currentTarget.value })}
                    placeholder="例如：医学影像 AI"
                    value={tag.name}
                  />
                </div>
                <div className="field">
                  <label>添加理由，可选</label>
                  <input
                    className="input"
                    onChange={(event) => updateDraftTag(tag.id, { reason: event.currentTarget.value })}
                    placeholder="例如：比机器学习更适合本帖语境"
                    value={tag.reason}
                  />
                </div>
              </div>
              <div className="field">
                <label>归属已有学科</label>
                <div className="topic-tags">
                  {leafDisciplines.map((discipline) => (
                    <label className="chip selectable-chip" key={discipline.id}>
                      <input
                        checked={tag.disciplineIds.includes(discipline.id)}
                        onChange={(event) => {
                          const nextIds = event.currentTarget.checked
                            ? unique([...tag.disciplineIds, discipline.id])
                            : tag.disciplineIds.filter((id) => id !== discipline.id);
                          updateDraftTag(tag.id, { disciplineIds: nextIds });
                          if (event.currentTarget.checked) {
                            setSelectedDisciplineIds((current) => unique([...current, discipline.id]));
                          }
                        }}
                        type="checkbox"
                      />{" "}
                      {discipline.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="field">
                <div className="section-header compact">
                  <label>如果学科也不存在，可以新建</label>
                  <button
                    className="button secondary small"
                    onClick={() =>
                      updateDraftTag(tag.id, {
                        newDisciplines: [...tag.newDisciplines, makeDraftDiscipline(rootDisciplines[0]?.id ?? "")]
                      })
                    }
                    type="button"
                  >
                    <Plus size={15} aria-hidden="true" />
                    新学科
                  </button>
                </div>
                {tag.newDisciplines.map((discipline) => (
                  <div className="grid grid-2 new-discipline-row" key={discipline.id}>
                    <select
                      className="select"
                      onChange={(event) =>
                        updateDraftDiscipline(tag.id, discipline.id, { parentId: event.currentTarget.value })
                      }
                      value={discipline.parentId}
                    >
                      {rootDisciplines.map((root) => (
                        <option key={root.id} value={root.id}>
                          {root.name}
                        </option>
                      ))}
                    </select>
                    <div className="inline-field">
                      <input
                        className="input"
                        onChange={(event) =>
                          updateDraftDiscipline(tag.id, discipline.id, { name: event.currentTarget.value })
                        }
                        placeholder="新学科名称"
                        value={discipline.name}
                      />
                      <button
                        className="button ghost small"
                        onClick={() =>
                          updateDraftTag(tag.id, {
                            newDisciplines: tag.newDisciplines.filter((item) => item.id !== discipline.id)
                          })
                        }
                        type="button"
                      >
                        <X size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <button className="button" disabled={pending} type="submit">
        {pending ? "创建中" : "发布 topic"}
      </button>
    </form>
  );
}
