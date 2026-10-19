import { guard, jsonError, readJsonObject, requirePermission } from "@/src/core/api";
import { createContact } from "@/src/features/contact/service";

/**
 * POST /api/contact/add   (an admin or editor: needs a login with the "write" permission)
 * Body (JSON, every field optional but at least one required):
 *   { "email", "phone", "mobile", "address", "openingHours" }
 * -> 201 { "contact": {...} }
 * -> 400 invalid input, 401 not logged in, 403 role not allowed, 409 contact information already exists
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requirePermission(request, "write");
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await createContact(body, session.user.id);
		return result.ok ? Response.json({ contact: result.value }, { status: 201 }) : jsonError(result.status, result.error);
	});
}
