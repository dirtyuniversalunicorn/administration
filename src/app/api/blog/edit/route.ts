import { guard, jsonError, readJsonObject, requireSession } from "@/src/core/api";
import { editBlog } from "@/src/features/blogs/service";

/**
 * POST /api/blog/edit   (admin: needs a login)
 * Body (JSON): { "id", ...only the fields to change } from title, excerpt, content, imageUrl.
 * The others keep their value. Send null or "" to clear the excerpt or the image.
 * -> 200 { "blog": {...} }
 * -> 400 invalid input, 401 not logged in, 404 no such blog
 */
export function POST(request: Request) {
	return guard(async () => {
		const session = await requireSession(request);
		if (session instanceof Response) return session;
		const body = await readJsonObject(request);
		if (body instanceof Response) return body;

		const result = await editBlog(body, session.user.id);
		return result.ok ? Response.json({ blog: result.value }) : jsonError(result.status, result.error);
	});
}
