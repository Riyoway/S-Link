import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import BackgroundAnimation from "@/components/background-animation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "S-Link",
  description:
    "実用的で利便性を重視したアシスタントWebアプリ - 学校生活を支援する統合プラットフォーム",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#317EFB",
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
        <BackgroundAnimation />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
