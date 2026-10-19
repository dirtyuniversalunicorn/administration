import { guard, jsonError, readJsonObject, requirePermission } from "@/src/core/api";
import { editContact } from "@/src/features/contact/service";

/**
 * POST /api/contact/edit   (an admin or editor: needs a login with the "write" permission)
 * Body (JSON): only the fields to change; the others keep their value.
 * Send null or "" to clear a field (at least one field must stay filled).
 * -> 200 { "contact": {...} }
 * -> 400 invalid input, 401 not logged in, 403 role not allowed, 404 nothing to edit yet
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requirePermission(request, "write");
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await editContact(body, session.user.id);
		return result.ok ? Response.json({ contact: result.value }) : jsonError(result.status, result.error);
	});
}
