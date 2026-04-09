export const primaryTabs = [
  { id: "feed", label: "Feed", href: "/" },
  { id: "garage", label: "Garage", href: "/garage" },
  { id: "settings", label: "Settings", href: "/settings" },
] as const;

export const architectureSurfaces = [
  "Pole Position",
  "Your Lane",
  "Pit Wall",
  "Explore",
  "Garage",
  "Alerts",
  "Settings",
] as const;

export const rankingModes = [
  "Balanced",
  "Fresh first",
  "Deep cuts",
  "Motorsport weekend",
  "Collector mode",
] as const;
