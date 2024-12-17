"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

import React from "react";

const contents: { title: string; content: string }[] = [
  {
    title: "Real-Time Monitoring",
    content:
      "Tracks critical parameters like temperature, pH levels, and dissolved oxygen with pinpoint accuracy.",
  },
  {
    title: "AI-Driven Insights",
    content:
      "Harnesses predictive analytics to anticipate issues before they arise, ensuring proactive maintenance and efficient water management.",
  },
  {
    title: "Automated Decision-Making",
    content:
      "Streamlines operations by automating key decisions, minimizing human intervention while maximizing precision.",
  },
  {
    title: "Anomaly Detection",
    content:
      "Identifies irregularities instantly to prevent costly problems and downtime.",
  },
  {
    title: "Smart Recommendations",
    content:
      "Provides actionable insights for optimizing water quality, reducing resource waste, and boosting performance.",
  },
];

export default function AuthSlider() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }} className="max-w-96">
      <CarouselContent>
        {contents.map(({ content, title }, i) => (
          <CarouselItem key={i}>
            <div className="space-y-2 text-center text-white">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-sm text-gray-100/75">{content}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-2 flex w-full items-center justify-center gap-2">
        <ChevronLeft
          size={16}
          className="text-white"
          role="button"
          onClick={() => api?.scrollPrev()}
        />
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 w-4",
              i + 1 === current ? "bg-white" : "bg-white/20",
            )}
          />
        ))}
        <ChevronRight
          size={16}
          className="text-white"
          role="button"
          onClick={() => api?.scrollNext()}
        />
      </div>
    </Carousel>
  );
}
