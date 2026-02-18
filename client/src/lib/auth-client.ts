import { createAuthClient } from "better-auth/react"

const BASE_URL = import.meta.env.VITE_BASEURL || 'https://ai-builders-2.onrender.com';

// Handle different deployment scenarios
// Localhost/Render: BASE_URL is full domain, need to add /api/auth
// Vercel: BASE_URL is /api, just add /auth
const authURL = BASE_URL.startsWith('/') ? `${BASE_URL}/auth` : `${BASE_URL}/api/auth`;

export const authClient = createAuthClient({
    baseURL: authURL,
    fetchOptions: {credentials: 'include'},
})

export const {signIn, signUp, useSession}= authClient;