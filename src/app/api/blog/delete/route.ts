import { guard, jsonError, readJsonObject, requirePermission } from "@/src/core/api";
import { deleteBlog } from "@/src/features/blogs/service";

/**
 * POST /api/blog/delete   (an admin: needs a login with the "delete" permission)
 * Body (JSON): { "id" }. Deletes the blog for good; to hide it instead, use /api/blog/status.
 * -> 200 { "deleted": true }
 * -> 400 id missing, 401 not logged in, 403 role not allowed, 404 no such blog
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requirePermission(request, "delete");
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await deleteBlog(body);
		return result.ok ? Response.json(result.value) : jsonError(result.status, result.error);
	});
}
