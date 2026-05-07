import { createAuthClient } from "better-auth/react";

const authClientBaseURL =
  import.meta.env.VITE_BASEURL || "https://ai-builders-2.onrender.com";

export const authClient = createAuthClient({
  baseURL: `${authClientBaseURL}/api/auth`,
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, useSession } = authClient;