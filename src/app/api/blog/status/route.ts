import { guard, jsonError, readJsonObject, requireSession } from "@/src/core/api";
import { setBlogStatus } from "@/src/features/blogs/service";

/**
 * POST /api/blog/status   (admin: needs a login)
 * Body (JSON): { "id", "status": "ACTIVE" | "INACTIVE" }
 * INACTIVE hides the blog from /api/blog/get (and the client-facing site) without deleting it.
 * -> 200 { "blog": {...} }
 * -> 400 invalid input, 401 not logged in, 404 no such blog
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requireSession(request);
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await setBlogStatus(body, session.user.id);
		return result.ok ? Response.json({ blog: result.value }) : jsonError(result.status, result.error);
	});
}
