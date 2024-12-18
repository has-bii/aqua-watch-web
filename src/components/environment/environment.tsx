import React from "react";
import { TEnvironemnt } from "@/types/model";
import { format } from "date-fns";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  data: TEnvironemnt;
};

export default function Environment({ data }: Props) {
  return (
    <Card role="button">
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        <CardDescription>
          {format(data.created_at, "dd MMMM yyyy")}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
