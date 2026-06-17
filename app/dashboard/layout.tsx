import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/auth-guard";
import { ThemeProvider } from "@/components/theme-provider";
import { AppearanceProvider } from "@/components/appearance-provider";
import { getDictionary } from "@/lib/dictionaries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await requireAuth("/dashboard");

  // @ts-ignore
  const lang = session?.user?.language || "ja_JP";
  const sidebarDict = await getDictionary(lang, 'sidebar');

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AppearanceProvider initialLang={lang as any}>
        <SidebarProvider>
          <AppSidebar dict={sidebarDict} />
          <SidebarInset>
            {children}
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </AppearanceProvider>
    </ThemeProvider>
  );
}
