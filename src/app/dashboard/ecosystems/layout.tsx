import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { cookies } from "next/headers";
import { Separator } from "@/components/ui/separator";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex w-full items-center gap-2 border-b px-4 py-3">
          <SidebarTrigger className="h-5 w-5" />
          <Separator orientation="vertical" />
          <span className="text-muted-foreground">All Ecosystems</span>
        </div>

        {/* Main Page */}
        <div className="flex-1 p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
