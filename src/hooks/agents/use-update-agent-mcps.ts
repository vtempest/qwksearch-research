/**
 * Update agent MCPs hook stub
 */

import { useMutation } from "@tanstack/react-query";

export interface UpdateAgentMCPsParams {
  agentId: string;
  mcps?: string[];
  custom_mcps?: any[];
  replace_mcps?: boolean;
}

/**
 * Hook to update agent MCPs
 */
export function useUpdateAgentMCPs() {
  return useMutation({
    mutationFn: async (params: UpdateAgentMCPsParams) => {
      // Stub implementation
      return { success: true };
    },
  });
}
