import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#317EFB",
};

export const metadata: Metadata = {
  title: "S-Link",
  description:
    "実用的で利便性を重視したアシスタントWebアプリ - 学校生活を支援する統合プラットフォーム",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    shortcut: "/icons/icon-192.png",
    apple: {
      url: "/icons/icon-192.png",
      sizes: "192x192",
      type: "image/png",
    },
    other: {
      rel: "icon",
      url: "/icons/icon-192.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
