"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackgroundAnimation from "@/components/background-animation";
import { Globe, ArrowLeft, Loader2, Mail, ExternalLink, ShieldCheck, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { LegalDocumentType, Language } from "@/types/index";

interface LegalPageLayoutProps {
  type: LegalDocumentType;
}

interface Section {
  title: string;
  content?: string;
  list?: string[];
  note?: string;
  services?: {
    name: string;
    desc: string;
    url: string;
  }[];
  email?: string;
}

interface LegalData {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: Section[];
  copyright?: {
    title: string;
    text: string;
    subtext: string;
  };
}

export function LegalPageLayout({ type }: LegalPageLayoutProps) {
  const [lang, setLang] = useState<Language>("ja_JP");
  const [data, setData] = useState<LegalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        let res = await fetch(`/locales/${lang}/${type}.json`);
        if (!res.ok && lang !== "ja_JP") {
          // Fallback to ja_JP if the selected language file is missing
          res = await fetch(`/locales/ja_JP/${type}.json`);
        }
        if (!res.ok) throw new Error("Failed to load locale");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [lang, type]);

  return (
    <div className="min-h-screen relative font-sans text-foreground transition-colors duration-500 selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      <BackgroundAnimation />
      
      {/* Navbar / Top Controls */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <Button asChild variant="ghost" className="gap-2 hover:bg-background/50 backdrop-blur-sm rounded-full">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Back to Home</span>
            </Link>
          </Button>
        </div>
        
        <div className="pointer-events-auto">
          <Select value={lang} onValueChange={(val: Language) => setLang(val)}>
            <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm border-white/20 dark:border-white/10 rounded-full shadow-lg hover:bg-background/80 transition-all">
              <Globe className="h-4 w-4 mr-2 text-indigo-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl border-white/20 dark:border-white/10 backdrop-blur-xl max-h-[400px]">
              <SelectItem value="ja_JP">
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
              </SelectItem>
              <SelectItem value="en_US">
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
              </SelectItem>
              <SelectItem value="en_GB">
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
              </SelectItem>
              <SelectItem value="en_AU">
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
              </SelectItem>
              <SelectItem value="en_CA">
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
              </SelectItem>
              <SelectItem value="en_IN">
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
              </SelectItem>
              <SelectItem value="en_NZ">
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
              </SelectItem>
              <SelectItem value="zh-CN">
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
              </SelectItem>
              <SelectItem value="zh-TW">
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
              </SelectItem>
              <SelectItem value="zh-HK">
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
              </SelectItem>
              <SelectItem value="ko_KR">
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
              </SelectItem>
              <SelectItem value="es_ES">
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
              </SelectItem>
              <SelectItem value="fr_FR">
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
              </SelectItem>
              <SelectItem value="de_DE">
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
              </SelectItem>
              <SelectItem value="it_IT">
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
              </SelectItem>
              <SelectItem value="pt_BR">
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
              </SelectItem>
              <SelectItem value="ru_RU">
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
              </SelectItem>
              <SelectItem value="ar_SA">
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
              </SelectItem>
              <SelectItem value="ar_EG">
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
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl relative z-10">
        {isLoading || !data ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Section */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center p-3 mb-4 sm:mb-6 rounded-2xl bg-linear-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 shadow-inner ring-1 ring-indigo-100 dark:ring-indigo-900">
                {type === "term" ? (
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-blue-600 to-indigo-600 dark:from-indigo-400 dark:via-blue-400 dark:to-indigo-400 animate-gradient-x bg-size-[200%_auto]">
                {data.title}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Last Updated: {data.lastUpdated}
              </p>
            </div>

            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10 overflow-hidden rounded-2xl sm:rounded-3xl">
              <CardContent className="p-6 sm:p-12">
                {/* Intro */}
                <div className="mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-border/50">
                  <p className="text-base sm:text-lg leading-relaxed font-medium text-foreground/90">
                    {data.intro}
                  </p>
                </div>

                {/* Sections */}
                <div className="space-y-12 sm:space-y-16">
                  {data.sections.map((section, index) => (
                    <section key={index} className="relative group">
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Modern Section Indicator (Vertical Line + Number) */}
                        <div className="hidden sm:flex flex-col items-center shrink-0 w-12 pt-1">
                          <span className="text-sm font-mono font-bold text-indigo-500/50 group-hover:text-indigo-500 transition-colors">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="h-full w-px bg-linear-to-b from-indigo-500/20 to-transparent mt-2 group-hover:from-indigo-500/50 transition-colors" />
                        </div>

                        <div className="flex-1">
                          <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                            <span className="sm:hidden text-indigo-500 font-mono text-base mr-2">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            {section.title}
                          </h2>

                          <div className="space-y-4 text-muted-foreground leading-relaxed">
                            {section.content && (
                              <p className="whitespace-pre-wrap">{section.content}</p>
                            )}

                            {section.list && (
                              <ul className="grid gap-3 pl-2">
                                {section.list.map((item, i) => (
                                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {section.services && (
                              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                                {section.services.map((service, i) => (
                                  <a 
                                    key={i} 
                                    href={service.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background hover:border-indigo-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group/card"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <h3 className="font-bold text-foreground group-hover/card:text-indigo-500 transition-colors">
                                        {service.name}
                                      </h3>
                                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/card:text-indigo-500 transition-colors" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {service.desc}
                                    </p>
                                  </a>
                                ))}
                              </div>
                            )}

                            {section.email && (
                              <div className="mt-6 flex justify-center">
                                <a 
                                  href={`mailto:${section.email}`}
                                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors border border-indigo-200/50 dark:border-indigo-800/50"
                                >
                                  <Mail className="h-4 w-4" />
                                  {section.email}
                                </a>
                              </div>
                            )}

                            {section.note && (
                              <div className="mt-4 p-4 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 text-sm">
                                {section.note}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>

                {/* Footer Copyright */}
                {data.copyright && (
                  <div className="mt-20 pt-10 border-t border-border/50 text-center">
                    <h3 className="font-bold mb-4 text-foreground/80">{data.copyright.title}</h3>
                    <div className="bg-muted/30 p-6 rounded-2xl text-xs sm:text-sm text-muted-foreground space-y-4">
                      <p>
                        &copy; 2025 S-Link. All rights reserved.
                      </p>
                      <p>
                        {data.copyright.text}
                      </p>
                      <p className="opacity-70">
                        {data.copyright.subtext}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
