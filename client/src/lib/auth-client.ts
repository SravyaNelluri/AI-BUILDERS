import { createAuthClient } from "better-auth/react"

const BASE_URL = import.meta.env.VITE_BASEURL || 'https://ai-builders-2.onrender.com';

export const authClient = createAuthClient({
    baseURL: `${BASE_URL}/api/auth`,
    fetchOptions: {credentials: 'include'},
})

export const {signIn, signUp, useSession}= authClient;