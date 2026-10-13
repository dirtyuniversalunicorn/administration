import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

function createAuth() {
	return betterAuth({
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
}

// Cloudflare Workers forbid I/O (and the pg client setup it triggers) in global
// scope, so the instance is built on first use inside a request, not at import.
let instance: ReturnType<typeof createAuth> | undefined;

export const auth = new Proxy({} as ReturnType<typeof createAuth>, {
	get(_target, prop) {
		instance ??= createAuth();
		return Reflect.get(instance, prop);
	},
});
