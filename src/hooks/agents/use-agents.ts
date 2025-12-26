"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Agent type definition
 */
export interface Agent {
  id: string;
  name?: string;
  custom_mcps?: Array<{
    name: string;
    type: string;
    config: Record<string, any>;
    enabledTools?: string[];
  }>;
  metadata?: {
    is_suna_default?: boolean;
    [key: string]: any;
  };
}

/**
 * Hook to fetch agent details by ID
 *
 * Note: This is a stub implementation. Update this hook to connect to your actual
 * agent management backend API when available.
 */
export const useAgent = (agentId: string) => {
  return useQuery({
    queryKey: ["agents", "detail", agentId],
    queryFn: async (): Promise<Agent | null> => {
      // Stub implementation - returns null
      // TODO: Implement actual API call when agent backend is available
      // Example:
      // const response = await backendApi.get(`/api/agents/${agentId}`);
      // return response;

      if (!agentId) {
        return null;
      }

      // For now, return a minimal agent object to prevent errors
      return {
        id: agentId,
        custom_mcps: [],
        metadata: {},
      };
    },
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
