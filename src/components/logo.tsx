import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-lg font-extrabold text-primary"
    >
      <span className="h-4 w-4 rotate-45 rounded bg-primary" />
      Aqua Watch
    </Link>
  );
}
