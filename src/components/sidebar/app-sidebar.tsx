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
import { Separator } from "../ui/separator";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type Menus = {
  label: string;
  items: Array<{
    href: string;
    label: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }>;
};

const SideBarMenu: Menus[] = [
  {
    label: "Ecosystems",
    items: [
      {
        href: "/dashboard/ecosystems",
        label: "All Ecosystems",
        icon: ContainerIcon,
      },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();

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
          {/* <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Select Workspace
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarHeader>

      <Separator orientation="horizontal" />

      {SideBarMenu.map((menu) => (
        <SidebarContent key={menu.label}>
          <SidebarGroup>
            <SidebarGroupLabel>{menu.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive>
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
