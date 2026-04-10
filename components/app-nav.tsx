import Link from "next/link";

import { primaryTabs } from "@/lib/app-shell";

type Tab = (typeof primaryTabs)[number]["id"];

export function AppNav({ current }: { current: Tab }) {
  return (
    <nav className="app-nav" aria-label="Primary">
      {primaryTabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={`app-nav-link ${current === tab.id ? "active" : ""}`}
          aria-current={current === tab.id ? "page" : undefined}
        >
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
