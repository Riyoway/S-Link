"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, History } from "lucide-react";
import { motion } from "framer-motion";
import { ChangelogItem } from "@/app/actions/dashboard";

type UpdateHistoryWidgetProps = {
  updates: ChangelogItem[];
  dict?: any;
};

export function UpdateHistoryWidget({ updates, dict }: UpdateHistoryWidgetProps) {
  if (!updates || updates.length === 0) return null;

  const latest = updates[0];
  const history = updates.slice(1);

  return (
    <Card className="h-full border-border/60 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <CardHeader className="pb-3 border-b bg-muted/20">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          {dict?.title || "Updates"}
        </CardTitle>
      </CardHeader>
      <div className="flex-1 flex flex-col min-h-0">
        {/* Latest Update Highlight */}
        <div className="p-4 bg-primary/5 border-b border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="default" className="bg-primary/80 hover:bg-primary/90 text-[10px] px-2 h-5">
              <Sparkles className="h-3 w-3 mr-1" />
              {dict?.new || "New"} {latest.version}
            </Badge>
            <span className="text-xs text-muted-foreground">{latest.date}</span>
          </div>
          <h3 className="font-bold text-sm mb-1">{latest.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {latest.content}
          </p>
        </div>

        {/* History List */}
        <ScrollArea className="flex-1">
          <div className="p-0">
            {history.map((update, idx) => (
              <motion.div 
                key={update.version}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 border-b last:border-0 hover:bg-muted/30 transition-colors group cursor-default"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      v{update.version}
                    </span>
                    <span className="text-xs text-muted-foreground/60 scale-75">•</span>
                    <span className="text-xs text-muted-foreground/80">{update.date}</span>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-2">
                   <div>
                        <p className="text-xs font-medium">{update.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 group-hover:line-clamp-none transition-all">
                            {update.content}
                        </p>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
