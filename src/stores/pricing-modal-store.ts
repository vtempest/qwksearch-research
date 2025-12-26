/**
 * Pricing modal store stub
 * This is a placeholder implementation for pricing modal functionality
 */

import { create } from "zustand";

interface PricingModalStore {
  isOpen: boolean;
  openPricingModal: () => void;
  closePricingModal: () => void;
}

/**
 * Zustand store for managing pricing modal state
 * This is a stub implementation
 */
export const usePricingModalStore = create<PricingModalStore>((set) => ({
  isOpen: false,
  openPricingModal: () => set({ isOpen: true }),
  closePricingModal: () => set({ isOpen: false }),
}));
