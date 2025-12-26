import { authClient } from '@/lib/auth-client';

/**
 * Supabase client wrapper that uses better-auth under the hood
 * This provides compatibility for code that expects Supabase's API
 */
export function createClient() {
  return {
    auth: {
      async getSession() {
        const { data: sessionData } = await authClient.getSession();

        // Transform better-auth session to match Supabase's expected format
        return {
          data: {
            session: sessionData?.session ? {
              token: sessionData.session.token,
              access_token: sessionData.session.token,
              user: sessionData.user,
            } : null,
          },
        };
      },
    },
  };
}
