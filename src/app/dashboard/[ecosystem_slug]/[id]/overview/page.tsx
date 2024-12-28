import Figure from "@/components/figure/figure";
import { FigureChart } from "@/components/figure/figure-chart";
import React from "react";

type Props = {};

export default function Overview({}: Props) {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Figure key={i} title="Temperature" figure="20°C" />
          ))}
        </div>

        <div className="lg:col-span-2">
          <FigureChart />
        </div>
      </div>
    </>
  );
}
