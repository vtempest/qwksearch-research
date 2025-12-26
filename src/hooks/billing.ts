/**
 * Billing hook stub
 * TODO: Implement proper billing state management
 */

export interface AccountState {
  subscription?: {
    tier_key?: string;
  };
  tier?: {
    name?: string;
  };
}

export function useAccountState() {
  // Stub implementation - returns undefined until proper billing is implemented
  return { data: undefined };
}

export function useDownloadRestriction(options?: { featureName?: string }) {
  // Stub implementation - no restrictions by default
  return {
    isRestricted: false,
    openUpgradeModal: () => {
      console.log("Upgrade modal would open here");
    },
  };
}
