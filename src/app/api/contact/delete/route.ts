import { guard, jsonError, readJsonObject, requirePermission } from "@/src/core/api";
import { deleteContact } from "@/src/features/contact/service";

/**
 * POST /api/contact/delete   (an admin: needs a login with the "delete" permission)
 * Body: `{}` (like the other writes, it must be JSON).
 * -> 200 { "deleted": true }
 * -> 401 not logged in, 403 role not allowed, 404 there is nothing to delete
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requirePermission(request, "delete");
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await deleteContact();
		return result.ok ? Response.json(result.value) : jsonError(result.status, result.error);
	});
}
