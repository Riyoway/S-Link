"use client";

import { CalendarIcon, InboxIcon, SearchIcon, Settings, LogOut, Bell, ListTodoIcon, CalculatorIcon, CalendarRangeIcon, LayoutDashboardIcon, NotepadTextIcon, MessageCircleIcon, BusFrontIcon, TimerIcon, ChevronsUpDown, BookIcon, Moon, Sun, Laptop, WrenchIcon, FileExclamationPointIcon, InfoIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { useAppearance } from "@/components/appearance-provider";
import changelog from "@/public/data/changelog.json";

export function AppSidebar({ dict }: { dict?: any }) {
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();
  const { dictionaries } = useAppearance();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Use client-side dictionary if available, otherwise server-side
  const sidebarDict = dictionaries?.sidebar || dict;
  const commonDict = dictionaries?.common;

  // Default labels if dict is missing or loading
  const t = (key: string, defaultText: string) => {
    return sidebarDict?.[key] || defaultText;
  };
  const ct = (key: string, defaultText: string) => {
    return commonDict?.[key] || defaultText;
  };

  const items = [
    {
      title: t("dashboard", "ダッシュボード"),
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    // 廃止された機能
    // {
    //   title: t("schedule", "時間割"),
    //   url: "/dashboard/schedule",
    //   icon: TimerIcon,
    // },
    {
      title: t("todo", "タスク管理"),
      url: "/dashboard/todo",
      icon: ListTodoIcon,
    },
    {
      title: t("bus", "バス予定表"),
      url: "/dashboard/bus",
      icon: BusFrontIcon,
    },
    // {
    //   title: t("events", "行事予定表"),
    //   url: "/dashboard/events",
    //   icon: CalendarIcon,
    // },
    {
      title: t("memo", "メモ帳"),
      url: "/dashboard/memo",
      icon: NotepadTextIcon,
    },
    {
      title: t("tools", "ツール"),
      url: "/dashboard/tools",
      icon: WrenchIcon,
    },
    {
      title: t("guide", "ガイド"),
      url: "/dashboard/guide",
      icon: BookIcon,
    },
    {
      title: t("about", "アプリ情報"),
      url: "/about",
      icon: InfoIcon,
    },
  ];

  const latestVersion = changelog.updates?.[0]?.version;  // バージョンさんしょうよううううううううう
  return (
    <>
      <Sidebar>
        <SidebarHeader className="py-6">
          <div className="flex items-center gap-3 px-4 select-none">
            <Image
              src="/icons/logo.png"
              alt="S-Link Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-2xl tracking-tight">S-Link</span>
              {latestVersion && <span className="text-xs text-muted-foreground">v{latestVersion}</span>}
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      className="text-base font-medium"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session?.user?.image || ""}
                        alt={session?.user?.name || ""}
                      />
                      <AvatarFallback className="rounded-lg">{session?.user?.name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{session?.user?.name || "ユーザー"}</span>
                      <span className="truncate text-xs text-muted-foreground">{session?.user?.email || ""}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-48 rounded-lg"
                  side="top"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={session?.user?.image || ""}
                          alt={session?.user?.name || ""}
                        />
                        <AvatarFallback className="rounded-lg">{session?.user?.name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{session?.user?.name || "ユーザー"}</span>
                        <span className="truncate text-xs">{session?.user?.email || ""}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setIsSettingsOpen(true)}
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {ct("settings", "設定")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {ct("logout", "ログアウト")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      {isSettingsOpen && (
        <SettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      )}
    </>
  );
}
