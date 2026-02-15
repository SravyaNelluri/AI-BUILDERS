import prisma from "./prisma";

const trustedOrigins = process.env.TRUSTED_ORIGINS?.split(",") || [];

// Validate required env vars (will be checked in server.ts after loading)
// These checks are deferred until runtime
let authPromise: Promise<ReturnType<typeof import("better-auth")["betterAuth"]>> | null = null;

export const getAuth = async () => {
  if (!authPromise) {
    authPromise = (async () => {
      const [{ betterAuth }, { prismaAdapter }] = await Promise.all([
        import("better-auth"),
        import("better-auth/adapters/prisma"),
      ]);

      return betterAuth({
        database: prismaAdapter(prisma, {
          provider: "postgresql",
        }),
        emailAndPassword: {
          enabled: true,
        },
        user: {
          deleteUser: { enabled: true },
        },
        trustedOrigins,
        baseURL: process.env.BETTER_AUTH_URL!,
        secret: process.env.BETTER_AUTH_SECRET!,
        advanced: {
          cookies: {
            session_token: {
              name: "auth_session",
              attributes: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                path: "/",
              },
            },
          },
        },
      });
    })();
  }

  return authPromise;
};