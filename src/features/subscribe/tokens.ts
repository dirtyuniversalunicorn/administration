import { subscribeFeature } from "./config";

/** 256-bit random token, hex encoded. Must be called inside a request (Workers). */
export function randomToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function isValidToken(token: string | null): token is string {
	return !!token && /^[0-9a-f]{64}$/.test(token);
}

/** This app's own public origin, used to build links placed in emails. */
function appOrigin(): string {
	return (process.env.BETTER_AUTH_URL ?? "").replace(/\/+$/, "");
}

export const confirmUrl = (token: string) =>
	`${appOrigin()}/api/subscribe/confirm?token=${token}`;

/** For footers of future emails: one click unsubscribes. */
export const unsubscribeUrl = (token: string) =>
	`${appOrigin()}/api/subscribe/delete?token=${token}`;

/** Where the visitor lands in the client-facing app after clicking an email link. */
export function resultRedirect(
	status: "confirmed" | "unsubscribed" | "invalid",
): Response {
	const base = (
		process.env.CLIENT_APP_URL ?? subscribeFeature.settings.clientAppUrl
	).replace(/\/+$/, "");
	return Response.redirect(
		`${base}${subscribeFeature.settings.resultPath}?status=${status}`,
		302,
	);
}
