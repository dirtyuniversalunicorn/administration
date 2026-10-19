import { guard, jsonError, readJsonObject, requireSession } from "@/src/core/api";
import { createContact } from "@/src/features/contact/service";

/**
 * POST /api/contact/add   (admin: needs a login)
 * Body (JSON, every field optional but at least one required):
 *   { "email", "phone", "mobile", "address", "openingHours" }
 * -> 201 { "contact": {...} }
 * -> 400 invalid input, 401 not logged in, 409 contact information already exists
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requireSession(request);
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await createContact(body, session.user.id);
		return result.ok ? Response.json({ contact: result.value }, { status: 201 }) : jsonError(result.status, result.error);
	});
}
