"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Settings, User, Palette, Globe, Info, X } from "lucide-react"
import { AccountSettings } from "./account-settings"
import { AppearanceSettings } from "./appearance-settings"
import { LanguageSettings } from "./language-settings"
import { AboutSettings } from "./about-settings"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useAppearance } from "@/components/appearance-provider"

interface SettingsDialogProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SettingsDialog({ children, open, onOpenChange }: SettingsDialogProps) {
  const { dictionaries } = useAppearance()
  const settingsDict = dictionaries?.settings
  const [activeTab, setActiveTab] = useState("account")

  const t = (path: string) => {
    if (!settingsDict) return ""
    const keys = path.split('.')
    let result = settingsDict
    for (const key of keys) {
      if (result === undefined || result === null) return path
      result = result[key]
    }
    return result || path
  }

  const sidebarItems = [
    {
      id: "account",
      title: t("account.title") || "アカウント",
      icon: User,
      component: AccountSettings,
    },
    {
      id: "appearance",
      title: t("appearance.title") || "外観",
      icon: Palette,
      component: AppearanceSettings,
    },
    {
      id: "language",
      title: t("language.title") || "言語",
      icon: Globe,
      component: LanguageSettings,
    },
    {
      id: "about",
      title: t("about.title") || "情報",
      icon: Info,
      component: AboutSettings,
    },
  ]
  
  const ActiveComponent = sidebarItems.find(item => item.id === activeTab)?.component || AccountSettings

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-4xl p-0 overflow-hidden h-[90vh] md:h-[80vh] flex flex-col md:flex-row gap-0 [&>button]:hidden">
        <VisuallyHidden>
            <DialogTitle>{t("title") || "設定"}</DialogTitle>
            <DialogDescription>
                {t("account.description") || "アプリケーションの設定を変更します。"}
            </DialogDescription>
        </VisuallyHidden>

        {/* Sidebar / Navigation */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r bg-muted/10 md:bg-muted/30 flex flex-col shrink-0">
          <div className="p-4 md:p-6 border-b flex items-center justify-between bg-background md:bg-transparent">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t("title") || "設定"}
            </h2>
            
            {/* Mobile Close Button (In Header) */}
            <div className="md:hidden">
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -mr-2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">閉じる</span>
                </Button>
              </DialogClose>
            </div>
          </div>
          
          <div className="flex-1 py-2 md:py-4 overflow-x-auto md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 px-4 md:px-3 min-w-max md:min-w-0 pb-2 md:pb-0">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start gap-2 md:gap-3 md:w-full rounded-full md:rounded-md px-4 md:px-3 h-9 md:h-10 transition-all",
                    activeTab === item.id 
                      ? "bg-primary/10 text-primary font-medium hover:bg-primary/15" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className={cn("h-4 w-4", activeTab === item.id ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm">{item.title}</span>
                </Button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col relative bg-background min-h-0">
          {/* Desktop Close Button (Fixed Top Right) */}
          <div className="absolute top-4 right-4 hidden md:block z-50">
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-accent hover:text-accent-foreground transition-colors">
                <X className="h-4 w-4" />
                <span className="sr-only">閉じる</span>
              </Button>
            </DialogClose>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-10 max-w-3xl mx-auto pb-20 md:pb-10">
              <div className="md:hidden mb-6 flex items-center gap-2 text-muted-foreground">
                 <Settings className="h-3 w-3" />
                 <span className="text-xs font-medium">{t("title") || "設定"} / {sidebarItems.find(i => i.id === activeTab)?.title}</span>
              </div>
              <ActiveComponent />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
