import TopNavigation from "@/components/top-navigation/top-navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function LandingLayout({ children }: Props) {
  return (
    <div className="w-screen overflow-x-hidden">
      <TopNavigation />
      <div className="">{children}</div>
    </div>
  );
}
