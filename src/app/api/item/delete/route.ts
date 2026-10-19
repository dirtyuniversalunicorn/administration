import { guard, jsonError, readJsonObject, requireSession } from "@/src/core/api";
import { deleteItem } from "@/src/features/items/service";

/**
 * POST /api/item/delete   (admin: needs a login)
 * Body (JSON): { "id" }. Deletes the item for good; to hide it instead, use /api/item/status.
 * -> 200 { "deleted": true }
 * -> 400 id missing, 401 not logged in, 404 no such item
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requireSession(request);
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await deleteItem(body);
		return result.ok ? Response.json(result.value) : jsonError(result.status, result.error);
	});
}
