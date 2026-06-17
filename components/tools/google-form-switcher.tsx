"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppearance } from "@/components/appearance-provider";
import { ExternalLink, Info, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GoogleFormSwitcherProps {
  tool: any;
  onBack: () => void;
}

export function GoogleFormSwitcher({ tool, onBack }: GoogleFormSwitcherProps) {
  const { dictionaries } = useAppearance();
  const dict = tool.popup || dictionaries.tools?.tools?.find((t: any) => t.id === "google_form_switcher")?.popup || {};
  
  const [accountIndex, setAccountIndex] = useState("0");
  const [selectedUrl, setSelectedUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");

  const dropdownOptions = tool.dropdown || [];

  useEffect(() => {
    generateLink();
  }, [accountIndex, selectedUrl, customUrl]);

  const generateLink = () => {
    let baseUrl = selectedUrl === "custom" ? customUrl : selectedUrl;
    
    if (!baseUrl) {
      setGeneratedUrl("");
      return;
    }

    try {
      if (!baseUrl.includes("docs.google.com/forms")) {
        setGeneratedUrl("");
        return;
      }

      const uIndexRegex = /\/u\/(\d+)\//;
      const match = baseUrl.match(uIndexRegex);

      let newUrl = baseUrl;
      if (match) {
        newUrl = baseUrl.replace(uIndexRegex, `/u/${accountIndex}/`);
      } else {
        newUrl = baseUrl.replace("/d/", `/u/${accountIndex}/d/`);
      }

      setGeneratedUrl(newUrl);
    } catch (e) {
      console.error("URL generation error", e);
      setGeneratedUrl("");
    }
  };

  const handleOpen = () => {
    if (generatedUrl) {
      window.open(generatedUrl, "_blank");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold tracking-tight">{dict.title}</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>設定</CardTitle>
              <CardDescription>{dict.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="account-index" className="text-sm font-medium">
                    {dict.labels?.account_index}
                  </Label>
                  <div className="relative">
                    <Input
                      id="account-index"
                      type="number"
                      min="0"
                      className="h-10 text-lg tabular-nums"
                      value={accountIndex}
                      onChange={(e) => setAccountIndex(e.target.value)}
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none text-xs text-muted-foreground">
                      番目
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url-select" className="text-sm font-medium">
                    {dict.labels?.url}
                  </Label>
                  <Select value={selectedUrl} onValueChange={setSelectedUrl}>
                    <SelectTrigger id="url-select" className="h-10">
                      <SelectValue placeholder="フォームを選択..." />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.map((option: any, i: number) => (
                        <SelectItem key={i} value={option.url}>
                          {option.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">直接入力 (Custom URL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedUrl === "custom" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <Input
                    placeholder="https://docs.google.com/forms/..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              )}

              <Button 
                size="lg" 
                className="w-full h-12 text-base font-semibold shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]" 
                onClick={handleOpen}
                disabled={!generatedUrl}
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                {dict.labels?.generate || "リンクを開く"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-muted/50 border-none shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                <Info className="h-5 w-5" />
                <CardTitle className="text-base">{dict.instructions?.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p className="leading-relaxed">
                {dict.instructions?.content}
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">{dict.instructions?.steps_title}</h4>
                <div className="grid gap-3">
                  {dict.instructions?.steps?.map((step: string, index: number) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background text-xs font-bold shadow-sm ring-1 ring-border">
                        {index + 1}
                      </div>
                      <span className="pt-0.5 leading-tight">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

