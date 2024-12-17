import TopNavigation from "@/components/top-navigation/top-navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen w-screen">
      <TopNavigation />
      {children}
    </div>
  );
}
