import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type Props = {
  isOpen?: boolean;
  href?: string;
};

export default function Logo({ isOpen, href }: Props) {
  return (
    <Link
      href={href ? href : "/"}
      className="flex items-center gap-2 text-lg font-extrabold text-primary"
    >
      <span className="h-4 w-4 rotate-45 rounded bg-primary" />
      <span className={cn("truncate", isOpen ? "block" : "hidden")}>
        Aqua Watch
      </span>
    </Link>
  );
}
