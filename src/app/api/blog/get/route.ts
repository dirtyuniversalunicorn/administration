import { guard, jsonError } from "@/src/core/api";
import { getPublicBlog, listPublicBlogs } from "@/src/features/blogs/queries";

export const dynamic = "force-dynamic";

/**
 * GET /api/blog/get   (public, CORS enabled for the client-facing site)
 * Only ACTIVE blogs are ever returned. Inactive ones don't exist for callers.
 *   no query     -> 200 { "blogs": [ { id, title, excerpt, imageUrl, createdAt } ] }  newest first
 *   ?id=<id>     -> 200 { "blog": { ...the same, plus content } }, or 404 when it is missing or inactive
 */
export function GET(request: Request) {
	return guard(async () => {
		const id = new URL(request.url).searchParams.get("id");
		if (id === null) return Response.json({ blogs: await listPublicBlogs() });

		const blog = await getPublicBlog(id);
		return blog ? Response.json({ blog }) : jsonError(404, "Blog not found.");
	});
}
