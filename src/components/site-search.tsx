"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { TopicSearchSuggestion } from "@/lib/types";

export function SiteSearch() {
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(currentQuery);
  const [suggestions, setSuggestions] = useState<TopicSearchSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Suggestion request failed");
        }

        const data = await response.json() as { suggestions?: TopicSearchSuggestion[] };
        const nextSuggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
        setSuggestions(nextSuggestions);
        setActiveIndex(-1);
        setOpen(true);
      } catch (error) {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showPanel = open && (loading || suggestions.length > 0);

  return (
    <form
      action="/topics"
      className="site-search"
      method="get"
      ref={containerRef}
      role="search"
    >
      <Search size={16} aria-hidden="true" />
      <input
        aria-label="搜索 topic"
        autoComplete="off"
        name="q"
        placeholder="搜索 topic、论文题目或 tag"
        value={query}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (suggestions.length > 0 || loading) {
            setOpen(true);
          }
        }}
        onKeyDown={(event) => {
          if (!showPanel) {
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
          }

          if (event.key === "Escape") {
            setOpen(false);
          }

          if (event.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
            event.preventDefault();
            window.location.href = suggestions[activeIndex].href;
          }
        }}
      />
      <button type="submit">
        搜索
      </button>
      {showPanel ? (
        <div className="site-search-panel">
          {loading ? <div className="site-search-status">正在搜索...</div> : null}
          {!loading && suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <a
                className={`site-search-item ${activeIndex === index ? "active" : ""}`}
                href={suggestion.href}
                key={suggestion.id}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span>{suggestion.title}</span>
                <small>{suggestion.subtitle}</small>
              </a>
            ))
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
