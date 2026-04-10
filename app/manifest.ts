import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oversteer",
    short_name: "Oversteer",
    description: "A trusted, swipe-first car news briefing app for enthusiasts.",
    start_url: "/",
    display: "standalone",
    background_color: "#080b0f",
    theme_color: "#080b0f",
    orientation: "portrait",
    lang: "en",
    categories: ["news", "sports", "lifestyle"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
