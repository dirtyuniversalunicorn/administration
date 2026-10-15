"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { blogsFeature } from "@/src/features/blogs/config";

export type BlogValues = {
	title: string;
	excerpt: string;
	content: string;
	imageUrl: string;
};

/** `values` echoes what was submitted, so a failed save doesn't wipe the form. */
export type BlogFormState = {
	ok: boolean;
	message: string;
	values?: BlogValues;
};

type BlogInput = {
	title: string;
	excerpt: string | null;
	content: string;
	imageUrl: string | null;
};

async function getSession() {
	return auth.api.getSession({ headers: await headers() });
}

function submittedValues(formData: FormData): BlogValues {
	const raw = (name: string) => String(formData.get(name) ?? "");
	return {
		title: raw("title"),
		excerpt: raw("excerpt"),
		content: raw("content"),
		imageUrl: raw("imageUrl"),
	};
}

/** Returns the cleaned input (empty optional fields become null), or an error message. */
function parseBlog(formData: FormData): BlogInput | string {
	const field = (name: string) => String(formData.get(name) ?? "").trim();
	const title = field("title");
	const excerpt = field("excerpt");
	const content = field("content");
	const imageUrl = field("imageUrl");

	if (!title) return "Title is required.";
	if (title.length > 150) return "Title can be at most 150 characters.";
	if (excerpt.length > 300) return "Summary can be at most 300 characters.";
	if (!content) return "Content is required.";
	if (content.length > 20000)
		return "Content can be at most 20,000 characters.";
	if (imageUrl) {
		try {
			const { protocol } = new URL(imageUrl);
			if (protocol !== "http:" && protocol !== "https:") throw new Error();
		} catch {
			return "Cover image link must be a valid http(s) URL.";
		}
		if (imageUrl.length > 2048) return "Cover image link is too long.";
	}
	return {
		title,
		excerpt: excerpt || null,
		content,
		imageUrl: imageUrl || null,
	};
}

export async function createBlogAction(
	_prev: BlogFormState,
	formData: FormData,
): Promise<BlogFormState> {
	const values = submittedValues(formData);
	const session = await getSession();
	if (!session) return { ok: false, message: "Not authorized.", values };

	const input = parseBlog(formData);
	if (typeof input === "string") return { ok: false, message: input, values };

	try {
		await prisma.blog.create({
			data: {
				...input,
				postedById: session.user.id,
				editedById: session.user.id,
			},
		});
	} catch (error) {
		console.error("createBlogAction failed", error);
		return { ok: false, message: "Failed to create the blog.", values };
	}
	revalidatePath(blogsFeature.routes.index);
	redirect(blogsFeature.routes.index);
}

/** Bind the id in the page: `updateBlogAction.bind(null, blog.id)`. */
export async function updateBlogAction(
	id: string,
	_prev: BlogFormState,
	formData: FormData,
): Promise<BlogFormState> {
	const values = submittedValues(formData);
	const session = await getSession();
	if (!session) return { ok: false, message: "Not authorized.", values };

	const input = parseBlog(formData);
	if (typeof input === "string") return { ok: false, message: input, values };

	try {
		// editedAt is refreshed automatically (@updatedAt); postedBy stays as is.
		await prisma.blog.update({
			where: { id },
			data: { ...input, editedById: session.user.id },
		});
	} catch (error) {
		console.error("updateBlogAction failed", error);
		return {
			ok: false,
			message: "Failed to save. Does the blog still exist?",
			values,
		};
	}
	revalidatePath(blogsFeature.routes.index);
	revalidatePath(blogsFeature.routes.detail(id));
	redirect(blogsFeature.routes.detail(id));
}

/** Bind the id in the page: `deleteBlogAction.bind(null, blog.id)`. */
export async function deleteBlogAction(id: string): Promise<void> {
	const session = await getSession();
	if (!session) throw new Error("Not authorized.");

	// deleteMany: deleting an already-removed blog is not an error.
	await prisma.blog.deleteMany({ where: { id } });
	revalidatePath(blogsFeature.routes.index);
	revalidatePath(blogsFeature.routes.detail(id));
	redirect(blogsFeature.routes.index);
}

/**
 * Show/hide a blog on the client-facing app without deleting it. Bind both
 * args in the page: `setBlogStatusAction.bind(null, blog.id, "INACTIVE")`.
 */
export async function setBlogStatusAction(
	id: string,
	status: "ACTIVE" | "INACTIVE",
): Promise<void> {
	const session = await getSession();
	if (!session) throw new Error("Not authorized.");

	await prisma.blog.updateMany({
		where: { id },
		data: {
			status,
			deactivatedAt: status === "INACTIVE" ? new Date() : null,
			// A status change also bumps editedAt, so record who did it.
			editedById: session.user.id,
		},
	});
	revalidatePath(blogsFeature.routes.index);
	revalidatePath(blogsFeature.routes.detail(id));
}
