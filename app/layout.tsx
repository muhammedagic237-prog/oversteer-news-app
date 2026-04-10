import type { Metadata, Viewport } from "next";

import { OversteerProvider } from "@/components/oversteer-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oversteer",
  description: "A trusted, relevance-ranked car news feed for enthusiasts.",
  applicationName: "Oversteer",
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: "Oversteer",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080b0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="app-body">
        <OversteerProvider>{children}</OversteerProvider>
      </body>
    </html>
  );
}
