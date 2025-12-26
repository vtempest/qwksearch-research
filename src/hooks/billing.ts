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
