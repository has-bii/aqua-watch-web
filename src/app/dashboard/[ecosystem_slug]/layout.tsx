import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { EcosystemSidebar } from "@/components/sidebar/ecosystem-sidebar";

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <EcosystemSidebar />
      <main className="flex flex-1 flex-col">{children}</main>
    </SidebarProvider>
  );
}
