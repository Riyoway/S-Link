"use client"

import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Moon, Sun, Laptop, Type } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppearance } from "@/components/appearance-provider"

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const { fontSize, setFontSize, fontFamily, setFontFamily, dictionaries } = useAppearance()
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("appearance.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("appearance.description")}
        </p>
      </div>
      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">{t("appearance.theme.title")}</h4>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 md:p-4 hover:bg-accent hover:text-accent-foreground",
              theme === "light" && "border-primary"
            )}
          >
            <Sun className="mb-2 md:mb-3 h-5 w-5 md:h-6 md:w-6" />
            <span className="text-[10px] md:text-xs font-medium">{t("appearance.theme.light")}</span>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 md:p-4 hover:bg-accent hover:text-accent-foreground",
              theme === "dark" && "border-primary"
            )}
          >
            <Moon className="mb-2 md:mb-3 h-5 w-5 md:h-6 md:w-6" />
            <span className="text-[10px] md:text-xs font-medium">{t("appearance.theme.dark")}</span>
          </button>
          <button
            onClick={() => setTheme("system")}
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 md:p-4 hover:bg-accent hover:text-accent-foreground",
              theme === "system" && "border-primary"
            )}
          >
            <Laptop className="mb-2 md:mb-3 h-5 w-5 md:h-6 md:w-6" />
            <span className="text-[10px] md:text-xs font-medium">{t("appearance.theme.system")}</span>
          </button>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          <h4 className="text-sm font-medium">{t("appearance.font.title")}</h4>
        </div>
        
        <div className="grid gap-2">
          <Label>{t("appearance.font.size")}</Label>
          <div className="flex items-center justify-between px-2 text-xs text-muted-foreground mb-2">
             <span>{t("appearance.font.sizes.small")}</span>
             <span>{t("appearance.font.sizes.medium")}</span>
             <span>{t("appearance.font.sizes.large")}</span>
             <span>{t("appearance.font.sizes.extra_large")}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="4" 
            value={
              fontSize === "small" ? 1 :
              fontSize === "medium" ? 2 :
              fontSize === "large" ? 3 : 4
            }
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val === 1) setFontSize("small");
              else if (val === 2) setFontSize("medium");
              else if (val === 3) setFontSize("large");
              else if (val === 4) setFontSize("extra-large");
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
          />
        </div>

        <div className="grid gap-2">
          <Label>{t("appearance.font.family")}</Label>
          <Select value={fontFamily} onValueChange={(val: any) => setFontFamily(val)}>
            <SelectTrigger>
              <SelectValue placeholder={t("appearance.font.family_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t("appearance.font.families.default")}</SelectItem>
              <SelectItem value="gothic">{t("appearance.font.families.gothic")}</SelectItem>
              <SelectItem value="mincho">{t("appearance.font.families.mincho")}</SelectItem>
              <SelectItem value="rounded">{t("appearance.font.families.rounded")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
