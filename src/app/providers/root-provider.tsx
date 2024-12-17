"use client";

import React from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export default function RootProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster theme="light" richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
