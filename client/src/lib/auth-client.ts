import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: `${import.meta.env.VITE_BASEURL}/api/auth`,
    fetchOptions: {credentials: 'include'},
})

export const {signIn, signUp, useSession}= authClient;