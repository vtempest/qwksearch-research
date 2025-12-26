import { useQuery } from "@tanstack/react-query";
import {
  composioApi,
  type ComposioProfile,
  type ComposioToolkitGroup,
  type ComposioMcpUrlResponse,
} from "./utils";
import { composioKeys } from "./keys";

export const useComposioProfiles = (params?: {
  toolkit_slug?: string;
  is_active?: boolean;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: composioKeys.profiles.list(params),
    queryFn: () => composioApi.getProfiles(params),
    enabled: params?.enabled ?? false, // Default to disabled
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to get a single profile
export const useComposioProfile = (profileId: string, enabled = true) => {
  return useQuery({
    queryKey: composioKeys.profiles.detail(profileId),
    queryFn: async () => {
      const profiles = await composioApi.getProfiles();
      return profiles.find((p) => p.profile_id === profileId) || null;
    },
    enabled: enabled && !!profileId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useComposioCredentialsProfiles = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: composioKeys.profiles.all(),
    queryFn: () => composioApi.getCredentialsProfiles(),
    enabled: options?.enabled ?? false, // Default to disabled
    staleTime: 5 * 60 * 1000,
  });
};

export const useComposioMcpUrl = (profileId: string, enabled = false) => {
  return useQuery({
    queryKey: composioKeys.profiles.mcpConfig(profileId),
    queryFn: () => composioApi.getMcpUrl(profileId),
    enabled: enabled && !!profileId,
    staleTime: 0,
    gcTime: 0,
  });
};
