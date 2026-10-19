import { auth } from "@/src/lib/auth";

/** JSON error body used by every API route: `{ "error": "message" }`. */
export function jsonError(status: number, message: string) {
	return Response.json({ error: message }, { status });
}

/**
 * Verifies the login. The proxy only checks that a session cookie exists, so
 * every admin-only route must call this itself. Returns the session, or a 401
 * response that the route should return as is:
 *
 *   const session = await requireSession(request);
 *   if (session instanceof Response) return session;
 */
export async function requireSession(request: Request) {
	const session = await auth.api.getSession({ headers: request.headers });
	return session ?? jsonError(401, "Unauthorized");
}

/**
 * Reads a JSON object body. Requires `Content-Type: application/json`, so a
 * plain cross-site HTML form cannot trigger a mutation. Returns the object, or
 * a 415 / 400 response that the route should return as is.
 */
export async function readJsonObject(request: Request): Promise<Record<string, unknown> | Response> {
	const type = request.headers.get("content-type") ?? "";
	if (!type.toLowerCase().startsWith("application/json")) {
		return jsonError(415, "Incorrect content type!");
	}
	const body: unknown = await request.json().catch(() => null);
	if (!body || typeof body !== "object" || Array.isArray(body)) {
		return jsonError(400, "The body must be a JSON object.");
	}
	return body as Record<string, unknown>;
}

/**
 * Runs a route handler and turns an unexpected error into a JSON 500 (the
 * details go to the log, not to the caller).
 */
export async function guard(run: () => Promise<Response>): Promise<Response> {
	try {
		return await run();
	} catch (error) {
		console.error("API route failed", error);
		return jsonError(500, "Internal server error.");
	}
}

/**
 * What a feature's write logic returns: the value, or the status and message
 * the route should answer with. Shared by every feature's service.ts.
 */
export type ServiceResult<T> = { ok: true; value: T } | { ok: false; status: 400 | 404 | 409; error: string };

export const fail = (status: 400 | 404 | 409, error: string) => ({ ok: false, status, error }) as const;
