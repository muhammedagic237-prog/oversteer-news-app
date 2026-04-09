import Link from "next/link";

type Tab = "feed" | "garage" | "settings";

const tabs: Array<{ id: Tab; label: string; href: string }> = [
  { id: "feed", label: "Feed", href: "/" },
  { id: "garage", label: "Garage", href: "/garage" },
  { id: "settings", label: "Settings", href: "/settings" },
];

export function AppNav({ current }: { current: Tab }) {
  return (
    <nav className="app-nav" aria-label="Primary">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={`app-nav-link ${current === tab.id ? "active" : ""}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
