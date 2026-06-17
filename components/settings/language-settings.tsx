"use client"

import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Globe } from "lucide-react"
import { useAppearance } from "@/components/appearance-provider"
import { updateLanguage } from "@/app/actions/profile"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function LanguageSettings() {
  const { language, setLanguage, dictionaries } = useAppearance()
  const router = useRouter()
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

  const handleLanguageChange = async (value: string) => {
    // 1. Optimistic UI update
    setLanguage(value as any)

    try {
      // 2. Update DB
      await updateLanguage(value)
      toast.success(t("language.save.success"))
      
      // 3. Refresh Server Components
      router.refresh()
    } catch (error) {
      toast.error(t("language.save.error"))
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("language.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("language.description")}
        </p>
      </div>
      <Separator />

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label>{t("language.display_language")}</Label>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Globe className="h-3 w-3" />
            <span>Almost all languages were translated by the GPT-5.2 model</span>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("language.placeholder")} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="ja_JP">
                <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/jp.png" 
                      alt="Japan Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>日本語</span>
                  </div>
                  <span className="text-muted-foreground text-xs">JA</span>
                </div>
              </SelectItem>
              <SelectItem value="en_US">
                <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/us.png" 
                      alt="USA Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>English (US)</span>
                  </div>
                  <span className="text-muted-foreground text-xs">EN</span>
                </div>
              </SelectItem>
              <SelectItem value="en_GB">
                <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/gb.png" 
                      alt="UK Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>English (UK)</span>
                  </div>
                  <span className="text-muted-foreground text-xs">EN</span>
                </div>
              </SelectItem>
              <SelectItem value="en_AU">
                <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/au.png" 
                      alt="Australia Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>English (AU)</span>
                  </div>
                  <span className="text-muted-foreground text-xs">EN</span>
                </div>
              </SelectItem>
              <SelectItem value="en_CA">
                <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/ca.png" 
                      alt="Canada Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>English (CA)</span>
                  </div>
                  <span className="text-muted-foreground text-xs">EN</span>
                </div>
              </SelectItem>
              <SelectItem value="en_IN">
                <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/in.png" 
                      alt="India Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>English (IN)</span>
                  </div>
                  <span className="text-muted-foreground text-xs">EN</span>
                </div>
              </SelectItem>
              <SelectItem value="en_NZ">
                <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/nz.png" 
                      alt="New Zealand Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>English (NZ)</span>
                  </div>
                  <span className="text-muted-foreground text-xs">EN</span>
                </div>
              </SelectItem>
              <SelectItem value="zh-CN">
                 <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/cn.png" 
                      alt="China Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>简体中文</span>
                  </div>
                  <span className="text-muted-foreground text-xs">ZH-CN</span>
                </div>
              </SelectItem>
              <SelectItem value="zh-TW">
                 <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/tw.png" 
                      alt="Taiwan Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>繁體中文</span>
                  </div>
                  <span className="text-muted-foreground text-xs">ZH-TW</span>
                </div>
              </SelectItem>
              <SelectItem value="zh-HK">
                 <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/hk.png" 
                      alt="Hong Kong Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>繁體中文 (HK)</span>
                  </div>
                  <span className="text-muted-foreground text-xs">ZH-HK</span>
                </div>
              </SelectItem>
              <SelectItem value="ko_KR">
                 <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/kr.png" 
                      alt="South Korea Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>한국어</span>
                  </div>
                  <span className="text-muted-foreground text-xs">KO</span>
                </div>
              </SelectItem>
              <SelectItem value="es_ES">
                 <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/es.png" 
                      alt="Spain Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>Español</span>
                  </div>
                  <span className="text-muted-foreground text-xs">ES</span>
                </div>
              </SelectItem>
              <SelectItem value="fr_FR">
                 <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/fr.png" 
                      alt="France Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>Français</span>
                  </div>
                  <span className="text-muted-foreground text-xs">FR</span>
                </div>
              </SelectItem>
              <SelectItem value="de_DE">
                 <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/de.png" 
                      alt="Germany Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>Deutsch</span>
                  </div>
                  <span className="text-muted-foreground text-xs">DE</span>
                </div>
              </SelectItem>
              <SelectItem value="it_IT">
                 <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/it.png" 
                      alt="Italy Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>Italiano</span>
                  </div>
                  <span className="text-muted-foreground text-xs">IT</span>
                </div>
              </SelectItem>
              <SelectItem value="pt_BR">
                 <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/br.png" 
                      alt="Brazil Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>Português</span>
                  </div>
                  <span className="text-muted-foreground text-xs">PT</span>
                </div>
              </SelectItem>
              <SelectItem value="ru_RU">
                 <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/ru.png" 
                      alt="Russia Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>Русский</span>
                  </div>
                  <span className="text-muted-foreground text-xs">RU</span>
                </div>
              </SelectItem>
              <SelectItem value="ar_SA">
                 <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/sa.png" 
                      alt="Saudi Arabia Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>العربية</span>
                  </div>
                  <span className="text-muted-foreground text-xs">AR</span>
                </div>
              </SelectItem>
              <SelectItem value="ar_EG">
                 <div className="flex items-center justify-between w-full min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="https://flagcdn.com/w40/eg.png" 
                      alt="Egypt Flag" 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover h-5 w-5"
                    />
                    <span>العربية (EG)</span>
                  </div>
                  <span className="text-muted-foreground text-xs">AR</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
