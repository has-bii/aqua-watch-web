import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LucideProps } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

type Props = {
  title: string;
  figure: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  isLoading?: boolean;
};

export default function Figure({
  title,
  figure,
  Icon,
  isLoading = false,
}: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {isLoading ? (
          <Skeleton className="h-4 w-20" />
        ) : (
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        )}
        <Icon />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <div className="text-4xl font-bold">{figure}</div>
        )}

        {/* <p className="text-xs text-muted-foreground">+19% from last month</p> */}
      </CardContent>
    </Card>
  );
}
