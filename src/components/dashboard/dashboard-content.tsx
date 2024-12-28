import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function DashboardContent({ children, className }: Props) {
  return <div className={cn("flex-1", className)}>{children}</div>;
}
