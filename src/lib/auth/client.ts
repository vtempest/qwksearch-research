/**
 * Auth client stub for authentication operations
 */
export const authClient = {
  async getSession() {
    return {
      data: {
        session: null,
      },
      error: null,
    };
  },
};
