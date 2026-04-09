import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oversteer",
  description: "A trusted, relevance-ranked car news feed for enthusiasts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
