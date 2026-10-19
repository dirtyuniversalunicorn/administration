import { guard, jsonError, readJsonObject, requireSession } from "@/src/core/api";
import { setItemStatus } from "@/src/features/items/service";

/**
 * POST /api/item/status   (admin: needs a login)
 * Body (JSON): { "id", "status": "ACTIVE" | "INACTIVE" }
 * INACTIVE hides the item from /api/item/get (and the client-facing site) without deleting it.
 * -> 200 { "item": {...} }
 * -> 400 invalid input, 401 not logged in, 404 no such item
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requireSession(request);
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await setItemStatus(body, session.user.id);
		return result.ok ? Response.json({ item: result.value }) : jsonError(result.status, result.error);
	});
}
