"use client";

import { Bot, Expand, FileText, MessageCircle, Minimize2, Send, Wand2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import type { AIChatMode, AIConversationMessage } from "@/lib/types";

type GuideStatus = "EMPTY" | "PENDING" | "COMPLETED" | "FAILED";
type PendingAction = "guide" | "chat" | null;

const modeLabels: Record<AIChatMode, string> = {
  ask: "随时问",
  clarify: "澄清思路",
  draft: "形成回复"
};

const modePlaceholders: Record<AIChatMode, string> = {
  ask: "输入不懂的术语、方法或背景问题。",
  clarify: "写下你的直觉。可输入 @2楼 或 #2 引用具体回复。",
  draft: "让 AI 根据上面的对话整理成可发布回复。"
};

const pendingText: Record<AIChatMode, string> = {
  ask: "正在定位术语语境...",
  clarify: "正在梳理你的想法...",
  draft: "正在整理成可发布回复..."
};

export function AITools({
  topicId,
  initialGuide,
  initialGuideStatus,
  guideIsStale,
  repliesSinceGuide,
  canPersistGuide
}: {
  topicId: string;
  initialGuide?: string;
  initialGuideStatus?: GuideStatus;
  guideIsStale: boolean;
  repliesSinceGuide: number;
  canPersistGuide: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [guideExpanded, setGuideExpanded] = useState(false);
  const [guide, setGuide] = useState(initialGuide ?? "");
  const [guideStatus, setGuideStatus] = useState<GuideStatus>(initialGuideStatus ?? (initialGuide ? "COMPLETED" : "EMPTY"));
  const [temporaryGuide, setTemporaryGuide] = useState(false);
  const [staleGuide, setStaleGuide] = useState(guideIsStale);
  const [newReplyCount, setNewReplyCount] = useState(repliesSinceGuide);
  const [mode, setMode] = useState<AIChatMode>("ask");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIConversationMessage[]>([]);
  const [lastDraft, setLastDraft] = useState("");
  const [chatWarnings, setChatWarnings] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isPending, startTransition] = useTransition();
  const pending = isPending || Boolean(pendingAction);

  async function post(path: string, body: unknown) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message ?? "AI 工具暂时不可用。");
    }

    return response.json();
  }

  function runAI<T>(action: PendingAction, task: () => Promise<T>) {
    setError("");
    setPendingAction(action);
    startTransition(async () => {
      try {
        await task();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "AI 工具暂时不可用。");
      } finally {
        setPendingAction(null);
      }
    });
  }

  function generateGuide(persist: boolean) {
    runAI("guide", async () => {
      setGuideStatus("PENDING");
      const data = await post(`/api/ai/topics/${topicId}/guide`, { persist });
      setGuide(data.content);
      setGuideStatus(data.status ?? "COMPLETED");
      setTemporaryGuide(Boolean(data.temporary));
      if (!data.temporary) {
        setStaleGuide(false);
        setNewReplyCount(0);
      }
    });
  }

  useEffect(() => {
    if (!guide && guideStatus === "PENDING" && canPersistGuide && !pendingAction) {
      generateGuide(true);
    }
  }, [guide, guideStatus, canPersistGuide, pendingAction]);

  function sendChat() {
    const trimmed = input.trim();

    if (!trimmed && (mode !== "draft" || !messages.length)) {
      return;
    }

    const history = messages;
    const outbound = trimmed || "请根据前面的讨论生成可发布回复。";
    const userMessage = { role: "user" as const, content: outbound };
    setInput("");
    setMessages([...history, userMessage]);
    setChatWarnings([]);

    runAI("chat", async () => {
      const data = await post(`/api/ai/topics/${topicId}/chat`, {
        mode,
        message: outbound,
        messages: history
      });
      const assistantMessage = { role: "assistant" as const, content: data.message };
      setMessages([...history, userMessage, assistantMessage]);
      setChatWarnings(Array.isArray(data.warnings) ? data.warnings : []);

      if (mode === "draft") {
        setLastDraft(data.message);
      }
    });
  }

  function applyDraftToReply() {
    if (!lastDraft) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("ai-draft-ready", {
        detail: {
          topicId,
          body: lastDraft
        }
      })
    );
  }

  return (
    <div className={`ai-tools ${expanded ? "expanded" : ""}`}>
      <div className="stack">
        <button
          className="button secondary"
          type="button"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? <Minimize2 size={16} aria-hidden="true" /> : <Expand size={16} aria-hidden="true" />}
          {expanded ? "恢复窄栏" : "展开 AI 面板"}
        </button>

        <section className="ai-box stack">
          <h3>
            <FileText size={18} aria-hidden="true" />
            AI 概览
          </h3>
          {guideStatus === "PENDING" && !guide ? (
            <p className="body-text muted">正在阅读 topic 并生成概览...</p>
          ) : guide ? (
            <>
              <p className={`body-text ai-guide-content ${guideExpanded ? "expanded" : ""}`}>{guide}</p>
              <button
                className="button ghost small"
                type="button"
                onClick={() => setGuideExpanded((value) => !value)}
              >
                {guideExpanded ? "收起概览" : "点击查看更多"}
              </button>
            </>
          ) : guideStatus === "FAILED" ? (
            <p className="body-text muted">概览生成失败，可以稍后再试。</p>
          ) : (
            <p className="body-text muted">这个 topic 还没有公共概览。</p>
          )}
          {temporaryGuide ? (
            <div className="notice">这是你本次临时生成的概览，离开或刷新页面后会消失。</div>
          ) : null}
          {staleGuide ? (
            <div className="notice">
              {newReplyCount >= 5
                ? `公共概览之后已有 ${newReplyCount} 条新回复，可以更新。`
                : "公共概览已经超过一周没有更新，可以更新。"}
            </div>
          ) : null}
          <button
            className="button secondary"
            disabled={pending}
            type="button"
            onClick={() => generateGuide(canPersistGuide)}
          >
            <Wand2 size={16} aria-hidden="true" />
            {pendingAction === "guide"
              ? "生成中"
              : canPersistGuide
                ? guide
                  ? "更新公共概览"
                  : "生成公共概览"
                : "临时生成概览"}
          </button>
        </section>

        <section className="panel stack">
          <h3>
            <Bot size={18} aria-hidden="true" />
            AI 助手
          </h3>
          <div className="segmented-control">
            {(Object.keys(modeLabels) as AIChatMode[]).map((item) => (
              <button
                className={mode === item ? "active" : ""}
                key={item}
                type="button"
                onClick={() => setMode(item)}
              >
                {modeLabels[item]}
              </button>
            ))}
          </div>
          {messages.length ? (
            <div className="ai-thread">
              {messages.map((message, index) => (
                <div className={`ai-message ${message.role}`} key={`${message.role}-${index}`}>
                  <span>{message.role === "user" ? "你" : "AI"}</span>
                  <p className="body-text">{message.content}</p>
                </div>
              ))}
              {pendingAction === "chat" ? (
                <div className="ai-message assistant">
                  <span>AI</span>
                  <p className="body-text muted">{pendingText[mode]}</p>
                </div>
              ) : null}
            </div>
          ) : pendingAction === "chat" ? (
            <div className="ai-message assistant">
              <span>AI</span>
              <p className="body-text muted">{pendingText[mode]}</p>
            </div>
          ) : null}
          {chatWarnings.length ? (
            <div className="notice">{chatWarnings.join(" ")}</div>
          ) : null}
          <textarea
            className="textarea compact"
            value={input}
            placeholder={modePlaceholders[mode]}
            onChange={(event) => setInput(event.target.value)}
          />
          <div className="button-row">
            <button
              className="button"
              disabled={pending || (!input.trim() && (mode !== "draft" || !messages.length))}
              type="button"
              onClick={sendChat}
            >
              <MessageCircle size={16} aria-hidden="true" />
              {pendingAction === "chat" ? "处理中" : modeLabels[mode]}
            </button>
            {lastDraft ? (
              <button className="button secondary" disabled={pending} type="button" onClick={applyDraftToReply}>
                <Send size={16} aria-hidden="true" />
                填入回复框
              </button>
            ) : null}
          </div>
        </section>
        {error ? <div className="error">{error}</div> : null}
      </div>
    </div>
  );
}
