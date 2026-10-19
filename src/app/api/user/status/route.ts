import { guard, jsonError, readJsonObject, requirePermission } from "@/src/core/api";
import { setUserStatus } from "@/src/features/users/services/setUserStatus";

/**
 * POST /api/user/status   (an admin: needs a login with the "users" permission)
 * Body (JSON): { "id", "status": "ACTIVE" | "INACTIVE" }
 * INACTIVE blocks sign-in and signs the user out; nothing is deleted.
 * -> 200 { "user": { "id", "status" } }
 * -> 400 invalid input, yourself, or the last active admin; 401 not logged in, 403 role not allowed; 404 no such user
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requirePermission(request, "users");
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await setUserStatus(body, session.user.id);
		return result.ok ? Response.json({ user: result.value }) : jsonError(result.status, result.error);
	});
}
