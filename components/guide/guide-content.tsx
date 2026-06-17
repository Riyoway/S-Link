"use client";

import { useState, useMemo } from "react";
import { Search, ExternalLink, FileText, Download, ChevronRight, AlertCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAppearance } from "@/components/appearance-provider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface GuideContentProps {
  initialDict: any;
}

export function GuideContent({ initialDict }: GuideContentProps) {
  const { dictionaries } = useAppearance();
  const dict = dictionaries?.guide || initialDict;
  const [searchQuery, setSearchQuery] = useState("");

  // Helper to flatten the dictionary for searching
  const searchItems = useMemo(() => {
    const items: { id: string; category: string; title: string; description?: string; keywords: string; data: any }[] = [];
    
    // Recursive function to traverse the guide structure
    const traverse = (obj: any, categoryId: string, categoryTitle: string, parentKey = "") => {
      Object.entries(obj).forEach(([key, value]: [string, any]) => {
        // Skip title/description at root level if processed
        if (key === "title" && parentKey === "") return;
        if (key === "ui") return; // Skip UI translations

        const currentKey = parentKey ? `${parentKey}.${key}` : key;

        // Check if this is a leaf node (content item)
        // A node is considered a content item if it has a title and (description or link or pdf or items)
        if (typeof value === "object" && value !== null && value.title) {
          const isCategory = !value.description && !value.link && !value.form_link && !value.pdf && Object.keys(value).some(k => typeof value[k] === 'object' && value[k]?.title);
          
          if (isCategory) {
             traverse(value, key, value.title, currentKey);
          } else {
             // It's a content item
             items.push({
               id: currentKey,
               category: categoryTitle, // Use the parent category title
               title: value.title,
               description: value.description || "",
               keywords: `${value.title} ${value.description || ""} ${categoryTitle} ${value.examples || ""} ${value.contact || ""} ${(value.items || value.actions || []).join(" ")}`,
               data: value
             });
          }
        } else if (key === "items" && Array.isArray(value)) {
           // Handle list of string items if parent didn't catch it (though usually inside an object with title)
        }
      });
    };

    // Manually trigger for top-level sections to ensure correct categorization
    // Grade Disclosure (MyPage)
    if (dict.mypage) {
      items.push({
        id: "mypage",
        category: dict.mypage.title,
        title: dict.mypage.title,
        description: dict.mypage.description,
        keywords: `${dict.mypage.title} ${dict.mypage.description}`,
        data: dict.mypage
      });
    }

    // Absence
    if (dict.absence) {
      items.push({
        id: "absence",
        category: dict.absence.title,
        title: dict.absence.title,
        description: dict.absence.description,
        keywords: `${dict.absence.title} ${dict.absence.description}`,
        data: dict.absence
      });
    }

    // Official Absence
    if (dict.official_absence) {
        traverse(dict.official_absence, "official_absence", dict.official_absence.title);
    }

    // Insurance
    if (dict.insurance) {
        traverse(dict.insurance, "insurance", dict.insurance.title);
    }
    
    // Exam
    if (dict.exam) {
        traverse(dict.exam, "exam", dict.exam.title);
    }

    // Personal
    if (dict.personal) {
        traverse(dict.personal, "personal", dict.personal.title);
    }

    // PC
    if (dict.pc) {
        traverse(dict.pc, "pc", dict.pc.title);
    }

    // Activities
    if (dict.activities) {
        traverse(dict.activities, "activities", dict.activities.title);
    }
    
    // Facilities
    if (dict.facilities) {
         // Facilities is a bit flat, handle manually
         const catTitle = dict.facilities.title;
         Object.entries(dict.facilities).forEach(([key, val]) => {
             if (key === "title") return;
             if (typeof val === "string") {
                 items.push({
                     id: `facilities.${key}`,
                     category: catTitle,
                     title: val,
                     description: "",
                     keywords: `${val} ${catTitle}`,
                     data: { title: val }
                 });
             }
         });
    }

    return items;
  }, [dict]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return searchItems;
    const lowerQuery = searchQuery.toLowerCase();
    return searchItems.filter((item) =>
      item.keywords.toLowerCase().includes(lowerQuery)
    );
  }, [searchItems, searchQuery]);

  // Group by category for display
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: typeof filteredItems } = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <div className="flex flex-col h-full space-y-6 p-4 max-w-5xl mx-auto w-full bg-slate-50/30 dark:bg-transparent">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 pt-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={dict.ui?.search_placeholder || "Search..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg shadow-sm bg-background"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 pr-4 -mr-4">
        <div className="space-y-8 pb-10">
          <AnimatePresence mode="wait">
            {Object.keys(groupedItems).length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20 text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-4">
                    <Search className="h-12 w-12 opacity-20" />
                    <p>{dict.ui?.no_results || "No results found"}</p>
                </div>
              </motion.div>
            ) : (
              Object.entries(groupedItems).map(([category, items], groupIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight text-primary/80">{category}</h2>
                    <Separator className="flex-1" />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => (
                      <GuideCard key={item.id} item={item} ui={dict.ui} />
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}

function GuideCard({ item, ui }: { item: any, ui: any }) {
  const { data } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary group">
        <CardHeader className="pb-3 space-y-2">
          <CardTitle className="text-base font-semibold leading-tight group-hover:text-primary transition-colors">
            {item.title}
          </CardTitle>
          {data.description && (
            <CardDescription className="text-xs line-clamp-3">
              {data.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
           {/* Custom rendering based on available data fields */}

           {/* Bereavement periods table */}
           {data.guide_periods && (
             <div className="bg-muted/50 rounded-md p-2 text-xs">
               {data.guide_periods.map((p: any, i: number) => (
                 <div key={i} className="flex justify-between py-1 border-b last:border-0 border-border/50">
                   <span className="font-medium">{p.relation}</span>
                   <span>{p.period}</span>
                 </div>
               ))}
             </div>
           )}

           {/* Items list */}
           {data.items && (
             <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
               {data.items.map((it: string, i: number) => (
                 <li key={i}>{it}</li>
               ))}
             </ul>
           )}

           {/* Notes/Examples */}
           {data.examples && (
             <div className="flex gap-2 text-xs text-muted-foreground">
               <Info className="h-3 w-3 mt-0.5 shrink-0" />
               <span>{data.examples}</span>
             </div>
           )}

           {/* Contact Info */}
           {data.contact && (
             <div className="mt-4 mb-2">
               <div className="border-2 border-primary/10 rounded-md px-3 py-2.5 bg-primary/5 relative">
                 <div className="text-[10px] font-bold text-primary/70 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                   <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                   {ui?.contact || "Contact"}
                 </div>
                 <div className="text-sm font-bold pl-3 text-foreground">{data.contact}</div>
               </div>
             </div>
           )}

           {/* Links and Actions */}
           <div className="flex flex-wrap gap-2 pt-2 mt-auto">
             {data.form_link && (
               <Button variant="outline" size="sm" className="h-auto min-h-7 py-1.5 text-xs gap-2 w-full justify-between group/btn whitespace-normal text-left items-center" asChild>
                 <a href={data.form_link} target="_blank" rel="noopener noreferrer">
                   <span className="flex-1 leading-tight">{data.form_text || ui?.form_text || "Application form"}</span>
                   <ExternalLink className="h-3 w-3 opacity-50 group-hover/btn:opacity-100 shrink-0" />
                 </a>
               </Button>
             )}
             {data.link && (
               <Button variant="outline" size="sm" className="h-auto min-h-7 py-1.5 text-xs gap-2 w-full justify-between group/btn whitespace-normal text-left items-center" asChild>
                 <a href={data.link} target="_blank" rel="noopener noreferrer">
                   <span className="flex-1 leading-tight">{data.link_text || ui?.external_link || "Link"}</span>
                   <ExternalLink className="h-3 w-3 opacity-50 group-hover/btn:opacity-100 shrink-0" />
                 </a>
               </Button>
             )}
             {data.pdf && (
               <Button variant="outline" size="sm" className="h-auto min-h-7 py-1.5 text-xs gap-2 w-full justify-between whitespace-normal text-left items-center group/btn" asChild>
                 <a href={data.pdf} target="_blank" rel="noopener noreferrer">
                   <span className="flex-1 leading-tight">{data.pdf_text || `PDF ${ui?.download || "Download"}`}</span>
                   <Download className="h-3 w-3 shrink-0 opacity-50 group-hover/btn:opacity-100" />
                 </a>
               </Button>
             )}
             {data.word && (
               <Button variant="outline" size="sm" className="h-auto min-h-7 py-1.5 text-xs gap-2 w-full justify-between whitespace-normal text-left items-center group/btn" asChild>
                 <a href={data.word} target="_blank" rel="noopener noreferrer">
                   <span className="flex-1 leading-tight">{data.word_text || `Word ${ui?.download || "Download"}`}</span>
                   <FileText className="h-3 w-3 shrink-0 opacity-50 group-hover/btn:opacity-100" />
                 </a>
               </Button>
             )}
             {data.excel && (
               <Button variant="outline" size="sm" className="h-auto min-h-7 py-1.5 text-xs gap-2 w-full justify-between whitespace-normal text-left items-center group/btn" asChild>
                 <a href={data.excel} target="_blank" rel="noopener noreferrer">
                   <span className="flex-1 leading-tight">{data.excel_text || `Excel ${ui?.download || "Download"}`}</span>
                   <FileText className="h-3 w-3 shrink-0 opacity-50 group-hover/btn:opacity-100" />
                 </a>
               </Button>
             )}
           </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
