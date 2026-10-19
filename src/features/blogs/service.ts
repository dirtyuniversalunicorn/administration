import { fail } from "@/src/core/api";
import { deleteBodySchema, parse, statusBodySchema } from "@/src/core/validation";
import { prisma } from "@/src/lib/prisma";
import { refresh } from "@/src/utils/refresh";
import { blogsFeature } from "./config";
import { adminBlogSelect } from "./queries";
import { addBlogSchema, editBlogSchema } from "./validation";

/*
 * The blogs' write logic, used by the /api/blog/* routes (and nothing else, so
 * the dashboard and external callers behave the same).
 */

/** Creates a blog. Title and content are required. */
export async function createBlog(body: Record<string, unknown>, userId: string) {
	const input = parse(addBlogSchema, body);

	if (!input.ok) return fail(400, input.error);

	const value = await prisma.blog.create({
		data: { ...input.value, postedById: userId, editedById: userId },
		select: adminBlogSelect,
	});
	refresh(blogsFeature.routes);
	return { ok: true, value } as const;
}

/**
 * Edits a blog. Only the fields present in the body change; the others keep
 * their value. Send null or "" to clear the summary or the cover image.
 */
export async function editBlog(body: Record<string, unknown>, userId: string) {
	const input = parse(editBlogSchema, body);
	if (!input.ok) return fail(400, input.error);
	const { id, ...changes } = input.value;
	if (Object.keys(changes).length === 0) return fail(400, "Send at least one field to change.");

	const existing = await prisma.blog.findUnique({ where: { id }, select: { id: true } });
	if (!existing) return fail(404, "Blog not found.");

	const value = await prisma.blog.update({
		where: { id },
		data: { ...changes, editedById: userId },
		select: adminBlogSelect,
	});
	refresh(blogsFeature.routes, id);
	return { ok: true, value } as const;
}

/** Deletes a blog for good. 404 if it does not exist. */
export async function deleteBlog(body: Record<string, unknown>) {
	const input = parse(deleteBodySchema, body);
	if (!input.ok) return fail(400, input.error);
	const { id } = input.value;

	const { count } = await prisma.blog.deleteMany({ where: { id } });
	if (count === 0) return fail(404, "Blog not found.");
	refresh(blogsFeature.routes, id);
	return { ok: true, value: { deleted: true } } as const;
}

/** Shows or hides a blog on the client-facing app without deleting it. */
export async function setBlogStatus(body: Record<string, unknown>, userId: string) {
	const input = parse(statusBodySchema, body);
	if (!input.ok) return fail(400, input.error);
	const { id, status } = input.value;

	const { count } = await prisma.blog.updateMany({
		where: { id },
		data: {
			status,
			deactivatedAt: status === "INACTIVE" ? new Date() : null,
			// A status change also bumps editedAt, so record who did it.
			editedById: userId,
		},
	});
	if (count === 0) return fail(404, "Blog not found.");

	const value = await prisma.blog.findUnique({ where: { id }, select: adminBlogSelect });
	refresh(blogsFeature.routes, id);
	return value ? ({ ok: true, value } as const) : fail(404, "Blog not found.");
}
