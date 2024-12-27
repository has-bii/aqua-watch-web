import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function DashboardContent({ children }: Props) {
  return <div className="flex-1 p-4">{children}</div>;
}
