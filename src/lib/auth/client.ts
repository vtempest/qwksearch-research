/**
 * Auth client stub
 */

export const authClient = {
  getSession: async () => {
    return { user: null, session: null };
  },
  signIn: async (credentials: any) => {
    return { success: false };
  },
  signOut: async () => {
    return { success: true };
  },
};
