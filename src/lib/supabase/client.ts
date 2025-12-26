/**
 * Supabase client stub
 * TODO: Implement proper Supabase integration if needed
 */

export function createClient() {
  // Stub implementation - returns a mock client
  return {
    auth: {
      getSession: async () => ({
        data: { session: null },
        error: null,
      }),
      getUser: async () => ({
        data: { user: null },
        error: null,
      }),
    },
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => ({
          data: null,
          error: new Error("Supabase not configured"),
        }),
        download: async (path: string) => ({
          data: null,
          error: new Error("Supabase not configured"),
        }),
        remove: async (paths: string[]) => ({
          data: null,
          error: new Error("Supabase not configured"),
        }),
        getPublicUrl: (path: string) => ({
          data: { publicUrl: "" },
        }),
      }),
    },
  };
}
