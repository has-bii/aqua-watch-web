"use client";

import {
  ContainerIcon,
  LogOutIcon,
  LucideProps,
  SettingsIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserSidebar from "./user-sidebar";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import Logo from "../logo";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useGetEnvironments } from "@/hooks/environment";

export type Menus = {
  label: string;
  items: Array<{
    href: string;
    label: string;
    isActive: boolean;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }>;
};

export function EcosystemSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();
  const supabase = createClient();
  const { data: environments } = useGetEnvironments(supabase);

  const { ecosystem_slug, aquarium_id } = React.useMemo(() => {
    const temp = pathname.substring(11).split("/");

    return {
      ecosystem_slug: temp[0],
      aquarium_id: temp[1] as string | undefined,
    };
  }, [pathname]);

  const sidebarItem: Menus[] = React.useMemo(() => {
    const filtered =
      environments
        ?.filter((env) =>
          ecosystem_slug === "no-ecosystem"
            ? env.ecosystem_slug === null
            : ecosystem_slug === env.ecosystem_slug,
        )
        .map((env): Menus["items"][0] => ({
          href: `/dashboard/${ecosystem_slug}/${env.id}`,
          label: env.name,
          icon: ContainerIcon,
          isActive: aquarium_id === env.id,
        })) ?? [];

    return [
      {
        label: "Aquarium/Ponds",
        items: [
          {
            href: `/dashboard/${ecosystem_slug}`,
            label: "All Aquariums",
            icon: ContainerIcon,
            isActive: aquarium_id === undefined,
          },
          ...filtered,
        ],
      },
    ] as Menus[];
  }, [aquarium_id, ecosystem_slug, environments]);

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Logo href="/dashboard/ecosystems" isOpen={open} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {sidebarItem.map((menu) => (
        <SidebarContent key={menu.label}>
          <SidebarGroup>
            <SidebarGroupLabel>{menu.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      ))}

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-fit items-center">
                  <UserSidebar />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/account">
                    <SettingsIcon />
                    Account
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <SettingsIcon />
                  <Link href='billing'>Billing</Link>
                  </DropdownMenuItem> */}
                <DropdownMenuItem className="text-destructive" onClick={logout}>
                  <LogOutIcon /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
