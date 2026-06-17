"use client"

import { useAppearance } from "@/components/appearance-provider"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface PageHeaderProps {
    title: string
    dictKey: string
    entryKey: string
}

export function PageHeader({ title: defaultTitle, dictKey, entryKey }: PageHeaderProps) {
    const { dictionaries } = useAppearance()

    // @ts-ignore
    const dict = dictionaries?.[dictKey]
    const title = dict?.[entryKey] || defaultTitle

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-all duration-300 ease-in-out">
            <SidebarTrigger className="-ml-1" />
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-2" />
            <h1 className="text-lg font-semibold">{title}</h1>
        </header>
    )
}
