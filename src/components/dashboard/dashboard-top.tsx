import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

type Props = {
  children?: React.ReactNode;
};

export default function DashboardTop({ children }: Props) {
  return (
    <div className="flex w-full items-center gap-2 border-b px-4 py-3">
      <SidebarTrigger className="h-5 w-5" />
      <Separator orientation="vertical" />
      {children}
    </div>
  );
}
