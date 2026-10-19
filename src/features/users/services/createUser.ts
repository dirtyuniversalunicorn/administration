import type { Role } from "@/src/core/auth/roles";
import { auth } from "@/src/lib/auth";

/**
 * Creates an email/password user. Goes through Better Auth's internal adapter
 * because public sign-up is disabled (and that flag also blocks auth.api.signUpEmail).
 * Does NOT create a session, so the calling admin stays logged in.
 */
export async function createUser(input: { name: string; email: string; password: string; role: Role }) {
	const context = await auth.$context;
	const email = input.email.trim().toLowerCase();

	if (input.password.length < context.password.config.minPasswordLength) {
		throw new Error(`Password must be at least ${context.password.config.minPasswordLength} characters.`);
	}
	if (await context.internalAdapter.findUserByEmail(email, { includeAccounts: false })) {
		throw new Error("A user with this email already exists.");
	}

	const user = await context.internalAdapter.createUser(
		{
			email,
			name: input.name.trim(),
			emailVerified: true,
			role: input.role,
			// 2nd arg is only used by the optional validateUserInfo hook, which this app doesn't configure.
		},
		undefined as never,
	);
	await context.internalAdapter.linkAccount({
		userId: user.id,
		providerId: "credential",
		accountId: user.id,
		password: await context.password.hash(input.password),
	});
	return user;
}
