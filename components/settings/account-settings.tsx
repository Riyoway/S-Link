"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useSession, signOut } from "next-auth/react"
import { Download, Trash2, Smartphone, LogOut, Save, Loader2, AlertTriangle, FileText, CheckSquare, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { updateProfile, getProfile, deleteAccount } from "@/app/actions/profile"
import { getAllUserData, deleteAllMemos, deleteAllTodos } from "@/app/actions/data"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { toast } from "sonner"
import { useAppearance } from "@/components/appearance-provider"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"

export function AccountSettings() {
  const { dictionaries } = useAppearance();
  const settingsDict = dictionaries?.settings;

  const t = (path: string) => {
    if (!settingsDict) return "";
    const keys = path.split('.');
    let result = settingsDict;
    for (const key of keys) {
      if (result === undefined || result === null) return path;
      result = result[key];
    }
    return result || path;
  };

  const formSchema = z
    .object({
      grade: z.string().min(1, t("account.validation.required")),
      lowGradeClass: z.string().optional(),
      highGradeCourse: z.string().optional(),
      caDepartment: z.string().optional(),
      commuteMethod: z.string().min(1, t("account.validation.required")),
    })
    .superRefine((data, ctx) => {
      const gradeNum = parseInt(data.grade);
      if (isNaN(gradeNum)) return;

      if (gradeNum <= 2) {
        if (!data.lowGradeClass) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("account.validation.required"),
            path: ["lowGradeClass"],
          });
        }
      } else {
        if (!data.highGradeCourse) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("account.validation.required"),
            path: ["highGradeCourse"],
          });
        }
        if (data.highGradeCourse === "CA" && !data.caDepartment) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("account.validation.required"),
            path: ["caDepartment"],
          });
        }
      }
    });

  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingMemos, setIsDeletingMemos] = useState(false);
  const [isDeletingTodos, setIsDeletingTodos] = useState(false);
  const [lastLogin, setLastLogin] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade: "",
      lowGradeClass: "",
      highGradeCourse: "",
      caDepartment: "",
      commuteMethod: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfile();
        if (data) {
          const grade = data.grade || "";
          let lowGradeClass = "";
          let highGradeCourse = "";
          let caDepartment = "";

          if (parseInt(grade) <= 2) {
            lowGradeClass = data.class || "";
          } else {
            if (data.course === "制御情報") highGradeCourse = "I";
            else if (data.course === "電気電子") highGradeCourse = "E";
            else if (data.course === "機械システム") highGradeCourse = "M";
            else if (data.course === "都市環境") {
              highGradeCourse = "CA";
              if (data.department === "土木") caDepartment = "C";
              else if (data.department === "建築") caDepartment = "A";
            }
          }

          form.reset({
            grade: grade,
            lowGradeClass: lowGradeClass,
            highGradeCourse: highGradeCourse,
            caDepartment: caDepartment,
            commuteMethod: data.commute_method?.toString() || "",
          });

          if (data.last_login) {
            setLastLogin(data.last_login);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    try {
      const gradeNum = parseInt(values.grade);
      let finalClass = "";
      let finalCourse = "";
      let finalDepartment = "";

      if (gradeNum <= 2) {
        finalCourse = "共通教育科";
        finalClass = values.lowGradeClass || "";
      } else {
        if (values.highGradeCourse === "I") {
          finalClass = "I";
          finalCourse = "制御情報";
        } else if (values.highGradeCourse === "E") {
          finalClass = "E";
          finalCourse = "電気電子";
        } else if (values.highGradeCourse === "M") {
          finalClass = "M";
          finalCourse = "機械システム";
        } else if (values.highGradeCourse === "CA") {
          finalCourse = "都市環境";
          if (values.caDepartment === "C") {
            finalClass = "C";
            finalDepartment = "土木";
          } else if (values.caDepartment === "A") {
            finalClass = "A";
            finalDepartment = "建築";
          }
        }
      }

      await updateProfile({
        grade: values.grade,
        class: finalClass,
        course: finalCourse,
        department: finalDepartment,
        commuteMethod: parseInt(values.commuteMethod),
      });
      toast.success(t("account.save.success"));
    } catch (e) {
      console.error("Failed to update profile:", e);
      toast.error(t("account.save.error"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteAccount() {
    setIsDeleting(true);
    try {
      await deleteAccount();
      await signOut({ callbackUrl: "/login" });
    } catch (e) {
      console.error("Failed to delete account:", e);
      setIsDeleting(false);
    }
  }

  async function handleExport() {
    setIsExporting(true);
    try {
      const data = await getAllUserData();
      if (!data) {
        throw new Error("No data found");
      }

      const zip = new JSZip();
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const rootFolder = zip.folder(`s-link_BKP${timestamp}`);

      // Memos
      const memoFolder = rootFolder?.folder("memo");
      data.memos.forEach((memo) => {
        const filename = (memo.title || "Untitled").replace(/[\\/:*?"<>|]/g, "_") || `memo_${memo.id}`;
        const content = `# ${memo.title}\n\n${memo.content}\n\n---\nCreated: ${memo.created_at}\nUpdated: ${memo.updated_at}`;
        memoFolder?.file(`${filename}.md`, content);
      });

      // Todos
      const todoFolder = rootFolder?.folder("todo");
      
      // Build tree for export
      const todoMap = new Map<string, any>();
      data.todos.forEach((todo) => {
        todoMap.set(todo.id, { ...todo, sub_todos: [] });
      });
      
      const rootTodos: any[] = [];
      data.todos.forEach((todo) => {
        if (todo.parent_id && todoMap.has(todo.parent_id)) {
          todoMap.get(todo.parent_id).sub_todos.push(todoMap.get(todo.id));
        } else {
          rootTodos.push(todoMap.get(todo.id));
        }
      });

      // Sort root todos: Incomplete first, then by date desc (same as app logic)
      const sortTodos = (list: any[]) => {
        list.sort((a, b) => {
          if (a.is_completed === b.is_completed) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return a.is_completed ? 1 : -1;
        });
        
        list.forEach(item => {
          if (item.sub_todos && item.sub_todos.length > 0) {
            sortTodos(item.sub_todos);
          }
        });
      };
      
      sortTodos(rootTodos);

      const generateTodoTree = (todos: any[], level = 0): string => {
        let content = "";
        const indent = "  ".repeat(level);
        
        todos.forEach((todo) => {
          const check = todo.is_completed ? "[x]" : "[ ]";
          content += `${indent}- ${check} ${todo.content}\n`;
          
          if (todo.sub_todos && todo.sub_todos.length > 0) {
            content += generateTodoTree(todo.sub_todos, level + 1);
          }
        });
        
        return content;
      };

      const allTodosContent = generateTodoTree(rootTodos);
      todoFolder?.file("todos.md", allTodosContent);

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `s-link_BKP${timestamp}.zip`);
      toast.success(t("account.data_management.export.success"));
    } catch (e) {
      console.error("Export failed:", e);
      toast.error(t("account.data_management.export.error"));
    } finally {
      setIsExporting(false);
    }
  }

  async function handleClearMemos() {
    setIsDeletingMemos(true);
    try {
      await deleteAllMemos();
      toast.success(t("account.data_management.clear_memos.success"));
    } catch (e) {
      console.error("Failed to delete memos:", e);
      toast.error(t("account.data_management.clear_memos.error"));
    } finally {
      setIsDeletingMemos(false);
    }
  }

  async function handleClearTodos() {
    setIsDeletingTodos(true);
    try {
      await deleteAllTodos();
      toast.success(t("account.data_management.clear_todos.success"));
    } catch (e) {
      console.error("Failed to delete todos:", e);
      toast.error(t("account.data_management.clear_todos.error"));
    } finally {
      setIsDeletingTodos(false);
    }
  }

  const watchGrade = form.watch("grade");
  const watchHighGradeCourse = form.watch("highGradeCourse");

  const gradeNum = parseInt(watchGrade || "0");
  const isLowGrade = gradeNum > 0 && gradeNum <= 2;
  const isHighGrade = gradeNum >= 3;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("account.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("account.description")}
        </p>
      </div>
      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">{t("account.profile.title")}</h4>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>
              {session?.user?.name?.slice(0, 2).toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {t("account.profile.google_image_note")}
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">{t("account.profile.display_name")}</Label>
          <Input
            id="name"
            value={session?.user?.name || ""}
            disabled
            readOnly
            className="bg-muted"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">{t("account.profile.email")}</Label>
          <Input
            id="email"
            value={session?.user?.email || ""}
            disabled
            readOnly
            className="bg-muted"
          />
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">{t("account.student_info.title")}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("account.student_info.grade")} <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("account.student_info.grade_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["1", "2", "3", "4", "5"].map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}{t("account.student_info.grade_unit")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isLowGrade && (
                <FormField
                  control={form.control}
                  name="lowGradeClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("account.student_info.class")} <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("account.student_info.class_placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((cls) => (
                            <SelectItem key={cls} value={cls.toString()}>
                              {cls}{t("account.student_info.class_unit")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isHighGrade && (
                <FormField
                  control={form.control}
                  name="highGradeCourse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("account.student_info.course")} <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          if (val !== "CA") form.setValue("caDepartment", "");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("account.student_info.course_placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="I">{t("account.student_info.courses.I")}</SelectItem>
                          <SelectItem value="E">{t("account.student_info.courses.E")}</SelectItem>
                          <SelectItem value="M">{t("account.student_info.courses.M")}</SelectItem>
                          <SelectItem value="CA">{t("account.student_info.courses.CA")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isHighGrade && watchHighGradeCourse === "CA" && (
                <FormField
                  control={form.control}
                  name="caDepartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("account.student_info.department")} <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("account.student_info.department_placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="C">{t("account.student_info.departments.C")}</SelectItem>
                          <SelectItem value="A">{t("account.student_info.departments.A")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="commuteMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("account.student_info.commute_method")} <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("account.student_info.commute_method_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">{t("account.student_info.commute_methods.bicycle")}</SelectItem>
                        <SelectItem value="2">{t("account.student_info.commute_methods.train")}</SelectItem>
                        <SelectItem value="3">{t("account.student_info.commute_methods.dormitory")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">{t("account.data_management.title")}</h4>
            <Card className="overflow-hidden">
               <div className="divide-y">
                   <div className="flex items-center justify-between p-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full shrink-0">
                           <Download className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t("account.data_management.export.title")}</p>
                          <p className="text-xs text-muted-foreground hidden sm:block">
                            {t("account.data_management.export.description")}
                          </p>
                        </div>
                     </div>
                     <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
                       {isExporting ? (
                         <>
                           <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                           {t("account.data_management.export.loading")}
                         </>
                       ) : (
                         t("account.data_management.export.button")
                       )}
                     </Button>
                   </div>

                   <div className="flex items-center justify-between p-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-destructive/10 rounded-full shrink-0">
                           <FileText className="h-4 w-4 text-destructive" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t("account.data_management.clear_memos.title")}</p>
                          <p className="text-xs text-muted-foreground hidden sm:block">
                            {t("account.data_management.clear_memos.description")}
                          </p>
                        </div>
                     </div>
                     <AlertDialog>
                       <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={isDeletingMemos}>
                           {t("account.data_management.clear_memos.button")}
                         </Button>
                       </AlertDialogTrigger>
                       <AlertDialogContent>
                         <AlertDialogHeader>
                           <AlertDialogTitle>{t("account.data_management.clear_memos.dialog.title")}</AlertDialogTitle>
                           <AlertDialogDescription>
                             {t("account.data_management.clear_memos.dialog.description")}
                           </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                           <AlertDialogCancel>{t("account.security.delete_account.dialog.cancel")}</AlertDialogCancel>
                           <AlertDialogAction onClick={handleClearMemos} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                             {t("account.security.delete_account.dialog.confirm")}
                           </AlertDialogAction>
                         </AlertDialogFooter>
                       </AlertDialogContent>
                     </AlertDialog>
                  </div>

                   <div className="flex items-center justify-between p-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-destructive/10 rounded-full shrink-0">
                           <CheckSquare className="h-4 w-4 text-destructive" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t("account.data_management.clear_todos.title")}</p>
                          <p className="text-xs text-muted-foreground hidden sm:block">
                            {t("account.data_management.clear_todos.description")}
                          </p>
                        </div>
                     </div>
                     <AlertDialog>
                       <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={isDeletingTodos}>
                           {t("account.data_management.clear_todos.button")}
                         </Button>
                       </AlertDialogTrigger>
                       <AlertDialogContent>
                         <AlertDialogHeader>
                           <AlertDialogTitle>{t("account.data_management.clear_todos.dialog.title")}</AlertDialogTitle>
                           <AlertDialogDescription>
                             {t("account.data_management.clear_todos.dialog.description")}
                           </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                           <AlertDialogCancel>{t("account.security.delete_account.dialog.cancel")}</AlertDialogCancel>
                           <AlertDialogAction onClick={handleClearTodos} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                             {t("account.security.delete_account.dialog.confirm")}
                           </AlertDialogAction>
                         </AlertDialogFooter>
                       </AlertDialogContent>
                     </AlertDialog>
                   </div>
               </div>
            </Card>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">{t("account.security.title")}</h4>
            <div className="rounded-md border p-4 bg-muted/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{t("account.security.last_login")}</span>
                <span className="font-medium">
                  {lastLogin ? new Date(lastLogin).toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : t("account.security.no_info")}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:text-white" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("account.save.loading")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("account.save.button")}
                </>
              )}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("account.security.delete_account.loading")}
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("account.security.delete_account.button")}
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    {t("account.security.delete_account.dialog.title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("account.security.delete_account.dialog.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("account.security.delete_account.dialog.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {t("account.security.delete_account.dialog.confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </Form>
    </div>
  )
}
