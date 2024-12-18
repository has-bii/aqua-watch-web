import React from "react";
import { TEnvironemnt } from "@/types/model";
import { Badge } from "@/components/ui/badge";
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
        <div className="inline-flex items-center gap-2">
          <CardTitle>{data.name}</CardTitle>
          <Badge variant="default">{data.env_type}</Badge>
        </div>
        <CardDescription>
          {format(data.created_at, "dd MMMM yyyy")}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
