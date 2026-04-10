export const primaryTabs = [
  { id: "feed", label: "Feed", href: "/" },
  { id: "tech", label: "Tech", href: "/tech" },
  { id: "garage", label: "Garage", href: "/garage" },
  { id: "settings", label: "Settings", href: "/settings" },
  { id: "account", label: "Account", href: "/account" },
] as const;

export const rankingModes = [
  "Balanced",
  "Fresh first",
  "Deep cuts",
  "Motorsport weekend",
  "Collector mode",
] as const;
