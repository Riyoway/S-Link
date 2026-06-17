"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ExternalLink } from "lucide-react";
import { SubjectPlan, SyllabusPaths, PlanWeek } from "@/app/actions/schedule";
import { useEffect, useRef, useState } from "react";

type SyllabusLinkProps = {
    subject: string;
    plan?: SubjectPlan;
    syllabusPaths?: SyllabusPaths;
    grade: string;
    course?: string;
    year?: string;
    week?: number;
    labels: {
        syllabus: string;
        pdf: string;
        week_prefix: string;
        week_suffix: string;
        preparation: string;
        review: string;
        this_week?: string;
    };
};

export function SyllabusLink({
    subject,
    plan,
    syllabusPaths,
    grade,
    course,
    year = new Date().getFullYear().toString(),
    week,
    labels
}: SyllabusLinkProps) {
    const [isOpen, setIsOpen] = useState(false);
    const currentWeekRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && currentWeekRef.current) {
            // Slight delay to allow Dialog animation/rendering
            setTimeout(() => {
                currentWeekRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
        }
    }, [isOpen]);


    // 1. If Plan exists, show detailed view
    if (plan) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-primary">
                        <FileText className="h-3 w-3 mr-1" />
                        {labels.syllabus}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>{subject}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="space-y-4">
                            {plan.schedule.map((w: PlanWeek) => {
                                const isCurrentWeek = w.week === week;
                                return (
                                    <div 
                                        key={w.week} 
                                        ref={isCurrentWeek ? currentWeekRef : null}
                                        className={`border-b pb-2 last:border-0 transition-colors duration-500 ${isCurrentWeek ? "bg-primary/5 -mx-2 px-2 py-2 rounded" : ""}`}
                                    >
                                        <div className={`font-semibold text-sm ${isCurrentWeek ? "text-primary" : ""}`}>
                                            {labels.week_prefix}{w.week}{labels.week_suffix}: {w.topic}
                                            {isCurrentWeek && <Badge variant="default" className="ml-2 text-[10px] h-4 px-1">{labels.this_week}</Badge>}
                                        </div>
                                        {(w.preparation || w.review) && (
                                            <div className="text-xs text-muted-foreground mt-1 grid gap-1">
                                                {w.preparation && <div><span className="font-semibold text-muted-foreground/70">{labels.preparation}:</span> {w.preparation}</div>}
                                                {w.review && <div><span className="font-semibold text-muted-foreground/70">{labels.review}:</span> {w.review}</div>}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    }

    // 2. Fallback to PDF if paths available
    if (syllabusPaths) {
        // syllabusPaths structure: { "1": { common: "..." }, "2": { common: "..." }, "3": { common: "...", "3m": "..." } }
        const gradeKey = grade.replace("g", ""); // "g3" -> "3"
        // @ts-ignore
        const yearPaths = syllabusPaths[gradeKey];

        if (yearPaths) {
            let pdfPath = yearPaths.common; // Default to common

            if (course) {
                const courseKey = `${gradeKey}${course.toLowerCase()}`;
                // @ts-ignore
                if (yearPaths[courseKey]) {
                    // @ts-ignore
                    pdfPath = yearPaths[courseKey];
                }
            }

            if (pdfPath) {
                const finalPath = pdfPath.replace("{YEAR}", year);
                return (
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-primary" asChild>
                        <a href={finalPath} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {labels.pdf}
                        </a>
                    </Button>
                );
            }
        }
    }

    return null;
}
