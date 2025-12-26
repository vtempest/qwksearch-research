/**
 * Agent hooks stub
 */

import { useQuery } from "@tanstack/react-query";

export interface Agent {
  id: string;
  name: string;
  mcps?: string[];
  [key: string]: any;
}

/**
 * Hook to fetch agent data
 */
export function useAgent(agentId?: string) {
  return useQuery<Agent | null>({
    queryKey: ["agent", agentId],
    queryFn: () => null,
    enabled: !!agentId,
  });
}
