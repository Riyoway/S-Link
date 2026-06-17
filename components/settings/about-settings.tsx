"use client"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useAppearance } from "@/components/appearance-provider"
export function AboutSettings() {
  const { dictionaries } = useAppearance()
  const settingsDict = dictionaries?.settings

  const t = (path: string) => {
    if (!settingsDict) return "";
    const keys = path.split('.');
    let result = settingsDict;
    for (const key of keys) {
      if (result === undefined || result === null) return path;
      result = result[key];
    }
    return result || path;
  };


  const latestVersion = "1.2.4";
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("about.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("about.description")}
        </p>
      </div>
      <Separator />

      <div className="flex flex-col items-center justify-center py-6 space-y-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-3xl shadow-lg ring-4 ring-white dark:ring-gray-800">
           <Image
            src="/icons/logo.png"
            alt="S-Link Logo"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">S-Link</h2>
          <p className="text-muted-foreground">Version {latestVersion}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-sm font-medium mb-4">{t("about.legal.title")}</h4>
        <div className="grid gap-2">
          <Button variant="outline" className="justify-start h-auto py-3" asChild>
            <Link href="/term" target="_blank">
              <div className="flex flex-col items-start">
                <span className="font-medium">{t("about.legal.terms.title")}</span>
                <span className="text-xs text-muted-foreground">{t("about.legal.terms.description")}</span>
              </div>
            </Link>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-3" asChild>
            <Link href="/privacy" target="_blank">
               <div className="flex flex-col items-start">
                <span className="font-medium">{t("about.legal.privacy.title")}</span>
                <span className="text-xs text-muted-foreground">{t("about.legal.privacy.description")}</span>
              </div>
            </Link>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-3" asChild>
            <Link href="/about" target="_blank">
               <div className="flex flex-col items-start">
                <span className="font-medium">{t("about.legal.about.title")}</span>
                <span className="text-xs text-muted-foreground">{t("about.legal.about.description")}</span>
              </div>
            </Link>
          </Button>
        </div>
      </div>

      <div className="pt-6 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; 2025 S-Link. All rights reserved.
        </p>
      </div>
    </div>
  )
}
