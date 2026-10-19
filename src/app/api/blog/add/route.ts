import { guard, jsonError, readJsonObject, requireSession } from "@/src/core/api";
import { createBlog } from "@/src/features/blogs/service";

/**
 * POST /api/blog/add   (admin: needs a login)
 * Body (JSON): { "title", "content" } required; "excerpt" and "imageUrl" optional.
 * -> 201 { "blog": {...} }
 * -> 400 invalid input, 401 not logged in
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requireSession(request);

		if (session instanceof Response) return session;
		const body = await readJsonObject(request);

		if (body instanceof Response) return body;

		const result = await createBlog(body, session.user.id);
		return result.ok ? Response.json({ blog: result.value }, { status: 201 }) : jsonError(result.status, result.error);
	});
}
