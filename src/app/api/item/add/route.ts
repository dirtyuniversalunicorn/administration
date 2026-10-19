import { guard, jsonError, readJsonObject, requireSession } from "@/src/core/api";
import { createItem } from "@/src/features/items/service";

/**
 * POST /api/item/add   (admin: needs a login)
 * Body (JSON, all required): { "category", "technique", "imageUrl" }
 * -> 201 { "item": {...} }
 * -> 400 invalid input, 401 not logged in
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requireSession(request);
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await createItem(body, session.user.id);
		return result.ok ? Response.json({ item: result.value }, { status: 201 }) : jsonError(result.status, result.error);
	});
}
