import { guard, jsonError, readJsonObject, requirePermission } from "@/src/core/api";
import { editItem } from "@/src/features/items/service";

/**
 * POST /api/item/edit   (an admin or editor: needs a login with the "write" permission)
 * Body (JSON): { "id", ...only the fields to change } from category, technique, imageUrl.
 * The others keep their value.
 * -> 200 { "item": {...} }
 * -> 400 invalid input, 401 not logged in, 403 role not allowed, 404 no such item
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requirePermission(request, "write");
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await editItem(body, session.user.id);
		return result.ok ? Response.json({ item: result.value }) : jsonError(result.status, result.error);
	});
}
