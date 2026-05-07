import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://ai-builders-2.onrender.com/api/auth",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, useSession } = authClient;