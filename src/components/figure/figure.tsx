import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ThermometerIcon } from "lucide-react";

type Props = {
  title: string;
  figure: string;
};

export default function Figure({ title, figure }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <ThermometerIcon />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{figure}</div>
        {/* <p className="text-xs text-muted-foreground">+19% from last month</p> */}
      </CardContent>
    </Card>
  );
}
