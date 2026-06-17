"use client";

import { useState } from "react";
import { useAppearance } from "@/components/appearance-provider";
import { GoogleFormSwitcher } from "./google-form-switcher";
import { SecurityTools } from "./security-tools";
import { ClassroomSearch } from "./classroom-search";
import { TeacherSearch } from "./teacher-search";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ToolsAppProps {
  dict?: any;
}

export function ToolsApp({ dict }: ToolsAppProps) {
  const { dictionaries } = useAppearance();
  // Prioritize client-side loaded dictionary, fallback to server-side passed dict
  const toolsDict = dictionaries.tools || dict || {};
  const tools = toolsDict.tools || [];

  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  const handleToolClick = (toolId: string) => {
    setActiveToolId(toolId);
  };

  const closeTool = () => {
    setActiveToolId(null);
  };

  const activeTool = tools.find((t: any) => t.id === activeToolId);

  if (activeToolId === "google_form_switcher" && activeTool) {
    return (
      <GoogleFormSwitcher
        tool={activeTool}
        onBack={closeTool}
      />
    );
  }
  if (activeToolId === "security_tools" && activeTool) {
    return (
      <SecurityTools
        tool={activeTool}
        onBack={closeTool}
      />
    );
  }
  if (activeToolId === "classroom_search" && activeTool) {
    return (
      <ClassroomSearch
        tool={activeTool}
        onBack={closeTool}
      />
    );
  }
  if (activeToolId === "teacher_search" && activeTool) {
    return (
      <TeacherSearch
        tool={activeTool}
        onBack={closeTool}
      />
    );
  }


  return (
    <div className="space-y-4">
      {tools.map((tool: any, index: number) => {
        const isInteractive = !!tool.id;

        return (
          <div
            key={index}
            className={cn(
              "group relative flex items-center gap-6 rounded-xl border bg-card p-6 transition-all hover:shadow-md",
              isInteractive ? "cursor-pointer hover:border-primary/50" : "opacity-60 cursor-not-allowed"
            )}
            onClick={() => isInteractive && handleToolClick(tool.id)}
          >
            {/* Icon Column */}
            <div className="flex-none">
              {tool.icon ? (
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl border bg-background shadow-sm transition-transform group-hover:scale-105">
                  <Image
                    src={tool.icon}
                    alt={tool.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                  <span className="text-3xl font-bold">
                    {tool.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Content Column */}
            <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="min-w-[200px] flex-none">
                <h3 className="text-lg font-bold leading-tight tracking-tight">
                  {tool.title}
                </h3>
              </div>

              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
