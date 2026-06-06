"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RecommendedTopic } from "@/lib/types";
import { truncate } from "@/lib/utils";

export function RecommendationDeck({ topics, variant = "section" }: { topics: RecommendedTopic[]; variant?: "section" | "hero" }) {
  const deckRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = topics.length;

  const activeTopic = topics[activeIndex];
  const summary = useMemo(() => {
    if (!activeTopic) {
      return "";
    }

    return activeTopic.aiGuide?.oneLineSummary || activeTopic.paperTitle || truncate(activeTopic.body, 96);
  }, [activeTopic]);

  function move(delta: number) {
    if (count === 0) {
      return;
    }

    setActiveIndex((current) => (current + delta + count) % count);
  }

  useEffect(() => {
    const deck = deckRef.current;

    if (!deck) {
      return;
    }

    function handleWheel(event: WheelEvent) {
      if (Math.abs(event.deltaY) < 12) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      move(event.deltaY > 0 ? 1 : -1);
    }

    deck.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      deck.removeEventListener("wheel", handleWheel);
    };
  }, [count]);

  if (!activeTopic) {
    return (
      <div className={`recommendation-empty ${variant === "hero" ? "hero-recommendation-empty" : ""}`}>
        还没有足够的 topic 生成今日推荐。
      </div>
    );
  }

  return (
    <div
      ref={deckRef}
      className={`recommendation-deck ${variant === "hero" ? "hero-recommendation-deck" : ""}`}
    >
      <button
        aria-label="上一张推荐"
        className="deck-arrow deck-arrow-left"
        type="button"
        onClick={() => move(-1)}
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>

      <Link className="recommendation-card" href={`/topics/${activeTopic.id}`}>
        <span className="deck-label">{activeTopic.recommendation.label}</span>
        {variant === "hero" ? <span className="hero-feature-kicker">今日跨界探索</span> : null}
        <h3>{activeTopic.title}</h3>
        <p>{summary}</p>
        <div className="deck-meta">
          <span>{activeTopic.disciplines.map((discipline) => discipline.name).join(" / ")}</span>
          {activeTopic.tags.length > 0 ? (
            <span>{activeTopic.tags.slice(0, 3).map((tag) => tag.name).join(" · ")}</span>
          ) : null}
        </div>
      </Link>

      <button
        aria-label="下一张推荐"
        className="deck-arrow deck-arrow-right"
        type="button"
        onClick={() => move(1)}
      >
        <ChevronRight size={22} aria-hidden="true" />
      </button>

      <div className="deck-dots" aria-label="推荐位置">
        {topics.map((topic, index) => (
          <button
            aria-label={`查看第 ${index + 1} 张推荐`}
            className={index === activeIndex ? "active" : ""}
            key={`${topic.id}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
