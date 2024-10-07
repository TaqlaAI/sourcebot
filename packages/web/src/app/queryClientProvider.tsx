'use client';

import * as React from "react"
import { QueryClient, QueryClientProvider as QueryClientProviderBase, QueryClientProviderProps } from "@tanstack/react-query"

const queryClient = new QueryClient();
 
export const QueryClientProvider = ({ children, ...props }: Omit<QueryClientProviderProps, 'client'>) => {
  return (
    <QueryClientProviderBase client={queryClient} {...props}>
        {children}
    </QueryClientProviderBase>
  )
}