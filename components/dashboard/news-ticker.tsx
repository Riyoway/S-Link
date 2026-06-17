"use client";

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import { ChangelogItem } from "@/app/actions/dashboard";

type NewsTickerProps = {
  updates: ChangelogItem[];
  dict?: any;
};

export function NewsTicker({ updates, dict }: NewsTickerProps) {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setWidth(textRef.current.offsetWidth);
    }
  }, [updates]);

  if (!updates || updates.length === 0) return null;

  // Show only the latest update with Version, Title, and Content
  const latest = updates[0];
  const tickerText = `[v${latest.version}]  ${latest.title}: ${latest.content}`;

  const TickerContent = () => (
    <div className="flex items-center mr-16">
      <span>{tickerText}</span>
    </div>
  );

  return (
    <div className="w-full bg-primary/5 border-b border-primary/10 overflow-hidden relative h-10 flex items-center">
      <div className="absolute left-0 z-10 bg-linear-to-r from-background to-transparent w-16 h-full" />
      <div className="absolute right-0 z-10 bg-linear-to-l from-background to-transparent w-16 h-full" />
      
      <div className="container max-w-7xl mx-auto flex items-center px-4 relative h-full">
        <Badge variant="default" className="shrink-0 mr-4 z-20 bg-primary/80 hover:bg-primary/90 text-[10px] h-6 px-2 gap-1">
          <Megaphone className="h-3 w-3" />
          {dict?.label || "Latest"}
        </Badge>
        
        <div className="flex-1 overflow-hidden relative h-full flex items-center" ref={containerRef}>
          <motion.div
            className="whitespace-nowrap flex items-center text-sm font-medium text-muted-foreground"
            animate={{ x: ["0%", "-30%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20, // Adjust speed
            }}
          >
            {/* Duplicate content for seamless loop */}
            <TickerContent />
            <TickerContent />
            <TickerContent />
            <TickerContent />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
