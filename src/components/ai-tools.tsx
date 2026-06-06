"use client";

import { Bot, Expand, FileText, MessageCircle, Minimize2, Send } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { AIChatMode, AIConversationMessage } from "@/lib/types";

type GuideStatus = "EMPTY" | "PENDING" | "COMPLETED" | "FAILED";
type PendingAction = "guide" | "chat" | null;

const modeLabels: Record<AIChatMode, string> = {
  ask: "随时问",
  clarify: "澄清思路",
  draft: "形成回复"
};

const modePlaceholders: Record<AIChatMode, string> = {
  ask: "输入不懂的术语、方法或背景问题。输入 #2 可引用具体回复。",
  clarify: "写下你的直觉。输入 #2 可引用具体回复。",
  draft: "让 AI 根据上面的对话整理成可发布回复。输入 #2 可引用具体回复。"
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
  canGenerateGuide
}: {
  topicId: string;
  initialGuide?: string;
  initialGuideStatus?: GuideStatus;
  canGenerateGuide: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [guideExpanded, setGuideExpanded] = useState(false);
  const [guide, setGuide] = useState(initialGuide ?? "");
  const [guideStatus, setGuideStatus] = useState<GuideStatus>(initialGuideStatus ?? (initialGuide ? "COMPLETED" : "EMPTY"));
  const [mode, setMode] = useState<AIChatMode>("ask");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIConversationMessage[]>([]);
  const [selectedReplyReferences, setSelectedReplyReferences] = useState<number[]>([]);
  const [lastDraft, setLastDraft] = useState("");
  const [chatWarnings, setChatWarnings] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isPending, startTransition] = useTransition();
  const pending = isPending || Boolean(pendingAction);
  const referenceCandidates = useMemo(() => {
    const matches = input.matchAll(/#\s*(\d+)/g);
    const values = Array.from(matches)
      .map((match) => Number(match[1]))
      .filter((value) => Number.isInteger(value) && value > 0 && !selectedReplyReferences.includes(value));

    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, [input, selectedReplyReferences]);

  function addReplyReference(floor: number) {
    setSelectedReplyReferences((current) => Array.from(new Set([...current, floor])).sort((a, b) => a - b));
  }

  function removeReplyReference(floor: number) {
    setSelectedReplyReferences((current) => current.filter((item) => item !== floor));
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

  async function postStream(
    path: string,
    body: unknown,
    handlers: {
      onMeta?: (data: unknown) => void;
      onDelta: (delta: string) => void;
      onDone?: (data: unknown) => void;
    }
  ) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message ?? "AI 工具暂时不可用。");
    }

    if (!response.body) {
      throw new Error("AI 工具暂时不可用。");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const eventText of events) {
        handleStreamEvent(eventText, handlers);
      }
    }

    buffer += decoder.decode();

    if (buffer.trim()) {
      handleStreamEvent(buffer, handlers);
    }
  }

  function handleStreamEvent(
    eventText: string,
    handlers: {
      onMeta?: (data: unknown) => void;
      onDelta: (delta: string) => void;
      onDone?: (data: unknown) => void;
    }
  ) {
    const lines = eventText.split(/\r?\n/);
    const event = lines
      .find((line) => line.startsWith("event:"))
      ?.slice("event:".length)
      .trim();
    const dataText = lines
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice("data:".length).trim())
      .join("\n");

    if (!event || !dataText) {
      return;
    }

    const data = JSON.parse(dataText);

    if (event === "meta") {
      handlers.onMeta?.(data);
    }

    if (event === "delta" && typeof data.delta === "string") {
      handlers.onDelta(data.delta);
    }

    if (event === "error") {
      throw new Error(data.message ?? "AI 工具暂时不可用。");
    }

    if (event === "done") {
      handlers.onDone?.(data);
    }
  }

  function generateGuide() {
    runAI("guide", async () => {
      let streamedGuide = "";

      setGuideStatus("PENDING");
      setGuide("");
      setGuideExpanded(true);

      try {
        await postStream(
          `/api/ai/topics/${topicId}/guide`,
          { stream: true },
          {
            onDelta(delta) {
              streamedGuide += delta;
              setGuide(streamedGuide);
            },
            onDone() {
              setGuideStatus("COMPLETED");
            }
          }
        );
      } catch (caught) {
        setGuideStatus("FAILED");
        throw caught;
      }

      if (!streamedGuide.trim()) {
        setGuideStatus("FAILED");
        throw new Error("AI 没有返回内容，请稍后再试。");
      }

      setGuideStatus("COMPLETED");
    });
  }

  useEffect(() => {
    if (!guide && guideStatus === "PENDING" && canGenerateGuide && !pendingAction) {
      generateGuide();
    }
  }, [guide, guideStatus, canGenerateGuide, pendingAction]);

  useEffect(() => {
    setGuide(initialGuide ?? "");
    setGuideStatus(initialGuideStatus ?? (initialGuide ? "COMPLETED" : "EMPTY"));
    setGuideExpanded(false);
  }, [topicId, initialGuide, initialGuideStatus]);

  function sendChat() {
    const trimmed = input.trim();

    if (!trimmed && (mode !== "draft" || !messages.length)) {
      return;
    }

    const history = messages;
    const outbound = trimmed || "请根据前面的讨论生成可发布回复。";
    const currentReplyReferences = selectedReplyReferences;
    const userMessage = { role: "user" as const, content: outbound, referencedReplyNumbers: currentReplyReferences };
    const assistantPlaceholder = { role: "assistant" as const, content: "" };
    setInput("");
    setSelectedReplyReferences([]);
    setMessages([...history, userMessage, assistantPlaceholder]);
    setChatWarnings([]);

    runAI("chat", async () => {
      let assistantText = "";

      try {
        await postStream(
          `/api/ai/topics/${topicId}/chat`,
          {
            mode,
            message: outbound,
            messages: history,
            referencedReplyNumbers: currentReplyReferences,
            stream: true
          },
          {
            onMeta(data) {
              const value = data as { warnings?: unknown };
              setChatWarnings(Array.isArray(value.warnings) ? value.warnings.map(String) : []);
            },
            onDelta(delta) {
              assistantText += delta;
              setMessages([...history, userMessage, { role: "assistant" as const, content: assistantText }]);
            }
          }
        );
      } catch (caught) {
        if (!assistantText) {
          setMessages([...history, userMessage]);
        }

        throw caught;
      }

      if (!assistantText.trim()) {
        setMessages([...history, userMessage]);
        throw new Error("AI 没有返回内容，请稍后再试。");
      }

      if (mode === "draft") {
        setLastDraft(assistantText);
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

  function togglePanelWidth() {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);
    setGuideExpanded(nextExpanded);
  }

  return (
    <div className={`ai-tools ${expanded ? "expanded" : ""}`}>
      <div className="stack">
        <button
          className="button secondary"
          type="button"
          onClick={togglePanelWidth}
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
            <p className="body-text muted">概览生成失败。楼主编辑主楼后会重新生成。</p>
          ) : (
            <p className="body-text muted">
              {guideStatus === "PENDING" ? "等待楼主生成主楼导读。" : "这个 topic 还没有主楼导读。"}
            </p>
          )}
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
                  {message.referencedReplyNumbers?.length ? (
                    <div className="ai-reference-list">
                      {message.referencedReplyNumbers.map((floor) => (
                        <strong key={floor}>#{floor}</strong>
                      ))}
                    </div>
                  ) : null}
                  <p className={`body-text ${message.content ? "" : "muted"}`}>
                    {message.content || (pendingAction === "chat" ? pendingText[mode] : "AI 没有返回内容。")}
                  </p>
                </div>
              ))}
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
          {referenceCandidates.length || selectedReplyReferences.length ? (
            <div className="ai-reference-picker">
              {referenceCandidates.map((floor) => (
                <button
                  className="chip selectable-chip"
                  key={`candidate-${floor}`}
                  type="button"
                  onClick={() => addReplyReference(floor)}
                >
                  引用 <strong>#{floor}</strong>
                </button>
              ))}
              {selectedReplyReferences.map((floor) => (
                <button
                  className="chip chip-button active-reference"
                  key={`selected-${floor}`}
                  type="button"
                  onClick={() => removeReplyReference(floor)}
                >
                  已引用 <strong>#{floor}</strong>
                </button>
              ))}
            </div>
          ) : null}
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
