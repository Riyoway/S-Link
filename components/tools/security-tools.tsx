"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, RefreshCw, ShieldCheck, KeyRound, Check, X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface SecurityToolsProps {
  tool: any;
  onBack: () => void;
}

export function SecurityTools({ tool, onBack }: SecurityToolsProps) {
  const [activeTab, setActiveTab] = useState("generator");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold tracking-tight">{tool.title}</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="generator">パスワード生成</TabsTrigger>
          <TabsTrigger value="checker">強度チェッカー</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="generator" className="m-0">
            <PasswordGenerator />
          </TabsContent>
          <TabsContent value="checker" className="m-0">
            <PasswordStrengthChecker />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function PasswordGenerator() {
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = lowercase;
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    let result = "";
    const array = new Uint32Array(length[0]);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length[0]; i++) {
      result += chars.charAt(array[i] % chars.length);
    }

    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeNumbers, includeSymbols]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast.success("パスワードをコピーしました");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>生成設定</CardTitle>
          <CardDescription>
            強力なパスワードを生成するための条件を設定します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>文字数: {length}</Label>
            </div>
            <Slider
              value={length}
              onValueChange={setLength}
              min={8}
              max={64}
              step={1}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="uppercase" className="flex flex-col space-y-1">
                <span>大文字を含める (A-Z)</span>
              </Label>
              <Switch
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="numbers" className="flex flex-col space-y-1">
                <span>数字を含める (0-9)</span>
              </Label>
              <Switch
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="symbols" className="flex flex-col space-y-1">
                <span>記号を含める (!@#$)</span>
              </Label>
              <Switch
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>生成結果</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="min-h-12 w-full rounded-md border bg-muted/50 p-3 pr-10 font-mono text-lg break-all flex items-center">
              {password}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={generatePassword}
              title="再生成"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={copyToClipboard} className="w-full" size="lg">
            <Copy className="mr-2 h-4 w-4" />
            コピーする
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PasswordStrengthChecker() {
  const [input, setInput] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  
  const calculateStrength = (pwd: string) => {
    if (!pwd) return { score: 0, feedback: [] };
    
    let score = 0;
    const feedback = [];
    
    // Length check
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 20;
    
    // Character type checks
    if (/[A-Z]/.test(pwd)) score += 15;
    else feedback.push("大文字を追加すると強度が上がります");
    
    if (/[a-z]/.test(pwd)) score += 15;
    
    if (/[0-9]/.test(pwd)) score += 15;
    else feedback.push("数字を追加すると強度が上がります");
    
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
    else feedback.push("記号を追加すると強度が上がります");
    
    return { score: Math.min(score, 100), feedback };
  };

  const { score, feedback } = calculateStrength(input);

  const getStrengthColor = (s: number) => {
    if (s <= 20) return "bg-red-500";
    if (s <= 40) return "bg-orange-500";
    if (s <= 60) return "bg-yellow-500";
    if (s <= 80) return "bg-lime-500";
    return "bg-green-500";
  };

  const getStrengthLabel = (s: number) => {
    if (s === 0) return "未入力";
    if (s <= 20) return "非常に弱い";
    if (s <= 40) return "弱い";
    if (s <= 60) return "普通";
    if (s <= 80) return "強い";
    return "非常に強い";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>パスワードチェック</CardTitle>
          <CardDescription>
            使用しているパスワードの強度を確認します（入力内容は送信されません）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>パスワード</Label>
            <div className="relative">
              <Input
                type={isVisible ? "text" : "password"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="確認したいパスワードを入力"
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>診断結果</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>強度: {getStrengthLabel(score)}</span>
              <span>{score}%</span>
            </div>
            <Progress value={score} className="h-2" indicatorClassName={getStrengthColor(score)} />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">改善アドバイス</h4>
            {feedback.length === 0 && score === 100 ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>非常に強力なパスワードです</span>
              </div>
            ) : feedback.length === 0 && score === 0 ? (
               <div className="text-sm text-muted-foreground">パスワードを入力してください</div>
            ) : (
              <ul className="space-y-2">
                {feedback.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-amber-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
                {score < 100 && feedback.length === 0 && (
                   <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    文字数を増やすとさらに強くなります
                  </li>
                )}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
