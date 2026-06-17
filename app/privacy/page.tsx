import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | S-Link",
  description: "S-Linkのプライバシーポリシーです。",
};

export default function PrivacyPolicy() {
  return <LegalPageLayout type="privacy" />;
}
