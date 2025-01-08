import SettingsNav from "@/components/settings/settings-nav";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ ecosystem_slug: string; id: string }>;
};

export default async function SettingsLayout({ children, params }: Props) {
  const { ecosystem_slug, id } = await params;

  return (
    <div className="flex h-fit items-start gap-6">
      <SettingsNav ecosystem_slug={ecosystem_slug} id={id} />
      {children}
    </div>
  );
}
