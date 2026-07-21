"use client";

import { useState } from "react";
import EditorialCard from "@/components/EditorialCard";

export type FeedItem = {
  href: string;
  kicker?: string;
  title: string;
  dek?: string;
  imageSrc?: string;
  dateLabel?: string;
};

type TabKey = "cases" | "blog" | "historid";

export default function CrossContentTabs({
  cases,
  blog,
  historid,
}: {
  cases: FeedItem[];
  blog: FeedItem[];
  historid: FeedItem[];
}) {
  const [tab, setTab] = useState<TabKey>("cases");

  const tabs: { key: TabKey; label: string; items: FeedItem[] }[] = [
    { key: "cases", label: "Cases", items: cases },
    { key: "blog", label: "Blog", items: blog },
    { key: "historid", label: "HistorID", items: historid },
  ];

  const active = tabs.find((t) => t.key === tab) ?? tabs[0];

  return (
    <div>
      <div
        className="flex gap-0 border-b border-[var(--border)]"
        role="tablist"
        aria-label="Browse content"
      >
        {tabs.map((t) => {
          const isActive = t.key === tab;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
                isActive
                  ? "border-[var(--primary)] text-[var(--foreground)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--primary)]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-x-6 gap-y-0 pt-2 sm:grid-cols-2" role="tabpanel">
        {active.items.map((item) => (
          <div key={item.href} className="border-b border-[var(--border)]">
            <EditorialCard
              href={item.href}
              kicker={item.kicker}
              title={item.title}
              dek={item.dek}
              imageSrc={item.imageSrc}
              dateLabel={item.dateLabel}
              variant="list"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
