"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function SiteSearch() {
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";

  return (
    <form
      action="/topics"
      className="site-search"
      method="get"
      role="search"
    >
      <Search size={16} aria-hidden="true" />
      <input
        aria-label="搜索 topic"
        defaultValue={currentQuery}
        key={currentQuery}
        name="q"
        placeholder="搜索 topic、论文题目或 tag"
      />
      <button type="submit">
        搜索
      </button>
    </form>
  );
}
