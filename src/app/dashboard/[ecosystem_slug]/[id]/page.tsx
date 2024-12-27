"use client";

import DashboardContent from "@/components/dashboard/dashboard-content";
import DashboardTop from "@/components/dashboard/dashboard-top";
import SelectedEcosystem from "@/components/top-navigation/selected-ecosystem";
import React from "react";

type Props = {
  params: Promise<{ ecosystem_slug: string; id: string }>;
};

export default function Page({ params }: Props) {
  return (
    <>
      <DashboardTop>
        <SelectedEcosystem params={params} />
      </DashboardTop>

      <DashboardContent>
        <div className="">hello</div>
      </DashboardContent>
    </>
  );
}
