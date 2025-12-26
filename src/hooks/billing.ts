/**
 * Billing hooks stub
 * This is a placeholder implementation for billing-related functionality
 */

import { useQuery } from "@tanstack/react-query";

export interface AccountState {
  subscription?: {
    tier_key: string;
  };
  tier?: {
    name: string;
  };
}

/**
 * Hook to get the current account state
 * Returns null in the stub implementation
 */
export function useAccountState() {
  return useQuery<AccountState | null>({
    queryKey: ["accountState"],
    queryFn: () => null,
    enabled: false, // Disabled since this is a stub
  });
}
