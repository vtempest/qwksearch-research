"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Parameters for updating agent MCPs
 */
export interface UpdateAgentMCPsParams {
  agentId: string;
  custom_mcps: Array<{
    name: string;
    type: string;
    config: Record<string, any>;
    enabledTools?: string[];
  }>;
  replace_mcps?: boolean;
}

/**
 * Hook to update agent MCPs (Model Context Protocol servers)
 *
 * Note: This is a stub implementation. Update this hook to connect to your actual
 * agent management backend API when available.
 */
export const useUpdateAgentMCPs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateAgentMCPsParams): Promise<void> => {
      // Stub implementation
      // TODO: Implement actual API call when agent backend is available
      // Example:
      // await backendApi.put(`/api/agents/${params.agentId}/mcps`, {
      //   custom_mcps: params.custom_mcps,
      //   replace_mcps: params.replace_mcps,
      // });

      console.warn(
        "useUpdateAgentMCPs: Stub implementation called. No backend API available.",
        params
      );

      // Simulate a successful operation
      return Promise.resolve();
    },
    onSuccess: (_data, variables) => {
      // Invalidate the agent query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["agents", "detail", variables.agentId],
      });
    },
    onError: (error) => {
      console.error("Failed to update agent MCPs:", error);
    },
  });
};
