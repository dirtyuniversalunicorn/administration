import { auth } from "./auth";

/**
 * Creates an email/password user. Goes through Better Auth's internal adapter
 * because public sign-up is disabled (and that flag also blocks auth.api.signUpEmail).
 * Does NOT create a session, so the calling admin stays logged in.
 */
export async function createUser(input: { name: string; email: string; password: string }) {
	const ctx = await auth.$context;
	const email = input.email.trim().toLowerCase();

	if (input.password.length < ctx.password.config.minPasswordLength) {
		throw new Error(
			`Password must be at least ${ctx.password.config.minPasswordLength} characters.`,
		);
	}
	if (await ctx.internalAdapter.findUserByEmail(email, { includeAccounts: false })) {
		throw new Error("A user with this email already exists.");
	}

	const user = await ctx.internalAdapter.createUser(
		{
			email,
			name: input.name.trim(),
			emailVerified: true,
			// 2nd arg is only used by the optional validateUserInfo hook, which this app doesn't configure.
		},
		undefined as never,
	);
	await ctx.internalAdapter.linkAccount({
		userId: user.id,
		providerId: "credential",
		accountId: user.id,
		password: await ctx.password.hash(input.password),
	});
	return user;
}
