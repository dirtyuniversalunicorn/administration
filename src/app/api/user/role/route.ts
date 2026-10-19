import { guard, jsonError, readJsonObject, requirePermission } from "@/src/core/api";
import { setUserRole } from "@/src/features/users/services/setUserRole";

/**
 * POST /api/user/role   (an admin: needs a login with the "users" permission)
 * Body (JSON): { "id", "role": "ADMIN" | "EDITOR" | "USER" }
 * -> 200 { "user": { "id", "role" } }
 * -> 400 invalid input, your own id, or the last active admin; 401 not logged in, 403 role not allowed; 404 no such user
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requirePermission(request, "users");
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await setUserRole(body, session.user.id);
		return result.ok ? Response.json({ user: result.value }) : jsonError(result.status, result.error);
	});
}
