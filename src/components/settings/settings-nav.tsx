"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { buttonVariants } from "../ui/button";

type Props = { ecosystem_slug: string; id: string };

export default function SettingsNav({ ecosystem_slug, id }: Props) {
  const pathname = usePathname();

  const navs = React.useMemo(() => {
    return [
      {
        label: "general",
        href: `/dashboard/${ecosystem_slug}/${id}/settings`,
      },
      {
        label: "device",
        href: `/dashboard/${ecosystem_slug}/${id}/settings/device`,
      },
      {
        label: "notifications",
        href: `/dashboard/${ecosystem_slug}/${id}/settings/notifications`,
      },
    ];
  }, [ecosystem_slug, id]);

  return (
    <ul>
      {navs.map((nav) => (
        <li key={nav.label} className="min-w-60">
          <Link
            href={nav.href}
            className={cn(
              buttonVariants({
                variant: nav.href === pathname ? "default" : "link",
              }),
              "w-full justify-start bg-opacity-20 capitalize text-foreground",
              nav.href === pathname && "text-white",
            )}
          >
            {nav.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
