import { guard, jsonError, readJsonObject, requirePermission } from "@/src/core/api";
import { createItem } from "@/src/features/items/service";

/**
 * POST /api/item/add   (an admin or editor: needs a login with the "write" permission)
 * Body (JSON, all required): { "category", "technique", "imageUrl" }
 * -> 201 { "item": {...} }
 * -> 400 invalid input, 401 not logged in, 403 role not allowed
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requirePermission(request, "write");
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await createItem(body, session.user.id);
		return result.ok ? Response.json({ item: result.value }, { status: 201 }) : jsonError(result.status, result.error);
	});
}
