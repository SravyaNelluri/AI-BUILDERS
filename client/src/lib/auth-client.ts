import { createAuthClient } from "better-auth/react"

const BASE_URL = import.meta.env.VITE_BASEURL || (import.meta.env.PROD ? window.location.origin : 'http://localhost:3000');

export const authClient = createAuthClient({
    baseURL: `${BASE_URL}/api/auth`,
    fetchOptions: {credentials: 'include'},
})

export const {signIn, signUp, useSession}= authClient;