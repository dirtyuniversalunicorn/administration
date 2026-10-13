import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    // Admin-only app: public self-registration is closed.
    // Users are created from /dashboard/users via createUser() in lib/create-user.ts.
    disableSignUp: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});
