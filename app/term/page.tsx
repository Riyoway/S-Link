import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | S-Link",
  description: "S-Linkの利用規約です。",
};

export default function TermsOfService() {
  return <LegalPageLayout type="term" />;
}
