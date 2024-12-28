import DashboardContent from "@/components/dashboard/dashboard-content";
import DashboardTop from "@/components/dashboard/dashboard-top";
import EnvironmentHeader from "@/components/environment/environment-header";
import SelectedEcosystem from "@/components/top-navigation/selected-ecosystem";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ ecosystem_slug: string; id: string }>;
};

export default async function Layout({ children, params }: Props) {
  const { ecosystem_slug, id } = await params;

  return (
    <>
      <DashboardTop>
        <SelectedEcosystem ecosystem_slug={ecosystem_slug} id={id} />
      </DashboardTop>

      <DashboardContent>
        <EnvironmentHeader ecosystem_slug={ecosystem_slug} id={id} />

        {/* Content */}
        <div className="h-full w-full bg-muted p-8">{children}</div>
      </DashboardContent>
    </>
  );
}
