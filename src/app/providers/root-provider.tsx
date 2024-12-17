"use client";

import React from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export default function RootProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster theme="light" richColors />
    </QueryClientProvider>
  );
}
