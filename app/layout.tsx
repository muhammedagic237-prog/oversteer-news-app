import type { Metadata } from "next";

import { OversteerProvider } from "@/components/oversteer-provider";
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
      <body>
        <OversteerProvider>{children}</OversteerProvider>
      </body>
    </html>
  );
}
