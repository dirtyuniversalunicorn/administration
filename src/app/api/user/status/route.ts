import { guard, jsonError, readJsonObject, requireSession } from "@/src/core/api";
import { setUserStatus } from "@/src/features/users/services/setUserStatus";

/**
 * POST /api/user/status   (admin: needs a login)
 * Body (JSON): { "id", "status": "ACTIVE" | "INACTIVE" }
 * INACTIVE blocks sign-in and signs the user out; nothing is deleted.
 * -> 200 { "user": { "id", "status" } }
 * -> 400 invalid input, yourself, or the last active user; 401 not logged in; 404 no such user
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requireSession(request);
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await setUserStatus(body, session.user.id);
		return result.ok ? Response.json({ user: result.value }) : jsonError(result.status, result.error);
	});
}
