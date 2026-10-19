import { guard, jsonError } from "@/src/core/api";
import { getPublicItem, listPublicItems } from "@/src/features/items/queries";

export const dynamic = "force-dynamic";

/**
 * GET /api/item/get   (public, CORS enabled for the client-facing site)
 * Only ACTIVE items are ever returned. Inactive ones don't exist for callers.
 *   no query     -> 200 { "items": [ { id, category, technique, imageUrl, createdAt } ] }  newest first
 *   ?id=<id>     -> 200 { "item": { ... } }, or 404 when it is missing or inactive
 */
export function GET(request: Request) {
	return guard(async () => {
		const id = new URL(request.url).searchParams.get("id");
		if (id === null) return Response.json({ items: await listPublicItems() });

		const item = await getPublicItem(id);
		return item ? Response.json({ item }) : jsonError(404, "Item not found.");
	});
}
