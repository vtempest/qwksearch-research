import { backendApi } from "@/lib/api-client";

export interface ComposioCategory {
  id: string;
  name: string;
}

export interface CompositoCategoriesResponse {
  success: boolean;
  categories: ComposioCategory[];
  total: number;
  error?: string;
}

export interface ComposioToolkit {
  slug: string;
  name: string;
  description?: string;
  logo?: string;
  tags: string[];
  auth_schemes: string[];
  categories: string[];
}

export interface AuthConfigField {
  name: string;
  displayName: string;
  type: string;
  description?: string;
  required: boolean;
  default?: string;
  legacy_template_name?: string;
}

export interface AuthConfigDetails {
  name: string;
  mode: string;
  fields: {
    [fieldType: string]: {
      [requirementLevel: string]: AuthConfigField[];
    };
  };
}

export interface DetailedComposioToolkit {
  slug: string;
  name: string;
  description?: string;
  logo?: string;
  tags: string[];
  auth_schemes: string[];
  categories: string[];
  auth_config_details: AuthConfigDetails[];
  connected_account_initiation_fields?: {
    [requirementLevel: string]: AuthConfigField[];
  };
  base_url?: string;
}

export interface DetailedComposioToolkitResponse {
  success: boolean;
  toolkit: DetailedComposioToolkit;
  error?: string;
}

export interface ComposioTool {
  slug: string;
  name: string;
  description: string;
  version: string;
  input_parameters: {
    properties: Record<string, any>;
    required?: string[];
  };
  output_parameters: {
    properties: Record<string, any>;
  };
  scopes?: string[];
  tags?: string[];
  no_auth: boolean;
}

export interface ComposioToolsResponse {
  success: boolean;
  tools: ComposioTool[];
  total_items: number;
  current_page: number;
  total_pages: number;
  next_cursor?: string;
  error?: string;
}

export interface ComposioToolkitsResponse {
  success: boolean;
  toolkits: ComposioToolkit[];
  total_items: number;
  total_pages: number;
  current_page: number;
  next_cursor?: string;
  has_more: boolean;
  error?: string;
}

export interface ComposioProfile {
  profile_id: string;
  profile_name: string;
  display_name: string;
  toolkit_slug: string;
  toolkit_name: string;
  mcp_url: string;
  redirect_url?: string;
  connected_account_id?: string;
  is_connected: boolean;
  is_default: boolean;
  created_at: string;
}

export interface ComposioProfilesResponse {
  success: boolean;
  profiles: ComposioProfile[];
  error?: string;
}

export interface CreateComposioProfileRequest {
  toolkit_slug: string;
  profile_name: string;
  display_name?: string;
  user_id?: string;
  mcp_server_name?: string;
  is_default?: boolean;
  initiation_fields?: Record<string, string>;
  custom_auth_config?: Record<string, string>;
  use_custom_auth?: boolean;
}

export interface CreateComposioProfileResponse {
  success: boolean;
  profile_id: string;
  redirect_url?: string;
  mcp_url: string;
  error?: string;
}

export interface ComposioMcpConfigResponse {
  success: boolean;
  mcp_config: {
    name: string;
    type: string;
    mcp_qualified_name: string;
    toolkit_slug: string;
    config: {
      profile_id: string;
    };
    enabledTools: string[];
  };
  error?: string;
}

export interface ComposioProfileSummary {
  profile_id: string;
  profile_name: string;
  display_name: string;
  toolkit_slug: string;
  toolkit_name: string;
  is_connected: boolean;
  is_default: boolean;
  created_at: string;
  has_mcp_url: boolean;
}

export interface ComposioToolkitGroup {
  toolkit_slug: string;
  toolkit_name: string;
  icon_url?: string;
  profiles: ComposioProfileSummary[];
}

export interface ComposioCredentialsResponse {
  success: boolean;
  toolkits: ComposioToolkitGroup[];
  total_profiles: number;
}

export interface ComposioMcpUrlResponse {
  success: boolean;
  mcp_url: string;
  profile_name: string;
  toolkit_name: string;
  warning: string;
}

export interface DeleteProfileResponse {
  message: string;
}

export interface BulkDeleteProfilesRequest {
  profile_ids: string[];
}

export interface BulkDeleteProfilesResponse {
  success: boolean;
  deleted_count: number;
  failed_profiles: string[];
  message: string;
}

export const composioApi = {
  async getCategories(): Promise<CompositoCategoriesResponse> {
    // Composio integration disabled - return empty response
    return {
      success: true,
      categories: [],
      total: 0,
    };
  },

  async getToolkits(
    search?: string,
    category?: string,
    cursor?: string,
  ): Promise<ComposioToolkitsResponse> {
    // Composio integration disabled - return empty response
    return {
      success: true,
      toolkits: [],
      total_items: 0,
      total_pages: 0,
      current_page: 1,
      has_more: false,
    };
  },

  async getProfiles(params?: {
    toolkit_slug?: string;
    is_active?: boolean;
  }): Promise<ComposioProfile[]> {
    // Composio integration disabled - return empty array
    return [];
  },

  async createProfile(
    request: CreateComposioProfileRequest,
  ): Promise<CreateComposioProfileResponse> {
    // Composio integration disabled
    throw new Error("Composio integration is disabled");
  },

  async getMcpConfigForProfile(
    profileId: string,
  ): Promise<ComposioMcpConfigResponse> {
    // Composio integration disabled
    throw new Error("Composio integration is disabled");
  },

  async discoverTools(
    profileId: string,
  ): Promise<{
    success: boolean;
    tools: any[];
    toolkit_name: string;
    total_tools: number;
  }> {
    // Composio integration disabled - return empty tools
    return {
      success: true,
      tools: [],
      toolkit_name: "",
      total_tools: 0,
    };
  },

  async getCredentialsProfiles(): Promise<ComposioToolkitGroup[]> {
    // Composio integration disabled - return empty array
    return [];
  },

  async getMcpUrl(profileId: string): Promise<ComposioMcpUrlResponse> {
    // Composio integration disabled
    throw new Error("Composio integration is disabled");
  },

  async getToolkitIcon(
    toolkitSlug: string,
  ): Promise<{ success: boolean; icon_url?: string }> {
    // Composio integration disabled - return no icon
    return {
      success: false,
    };
  },

  async getToolkitDetails(
    toolkitSlug: string,
  ): Promise<DetailedComposioToolkitResponse> {
    // Composio integration disabled
    throw new Error("Composio integration is disabled");
  },

  async getTools(
    toolkitSlug: string,
    limit: number = 50,
  ): Promise<ComposioToolsResponse> {
    // Composio integration disabled - return empty tools
    return {
      success: true,
      tools: [],
      total_items: 0,
      current_page: 1,
      total_pages: 0,
    };
  },

  async deleteProfile(profileId: string): Promise<DeleteProfileResponse> {
    // Composio integration disabled
    throw new Error("Composio integration is disabled");
  },

  async bulkDeleteProfiles(
    profileIds: string[],
  ): Promise<BulkDeleteProfilesResponse> {
    // Composio integration disabled
    throw new Error("Composio integration is disabled");
  },

  async setDefaultProfile(profileId: string): Promise<{ message: string }> {
    // Composio integration disabled
    throw new Error("Composio integration is disabled");
  },

  async checkProfileNameAvailability(
    toolkitSlug: string,
    profileName: string,
  ): Promise<{ available: boolean; message: string; suggestions: string[] }> {
    // Composio integration disabled - always return available
    return {
      available: true,
      message: "Composio integration is disabled",
      suggestions: [],
    };
  },
};
