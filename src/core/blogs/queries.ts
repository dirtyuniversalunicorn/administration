import { prisma } from "@/src/lib/prisma";

/**
 * Everything the client-facing app may show: ACTIVE blogs only. Use these two
 * functions (not prisma.blog directly) for any public endpoint, so an inactive
 * blog can never leak out by accident. The admin pages query prisma directly
 * because admins see all statuses.
 */
export function listPublicBlogs() {
	return prisma.blog.findMany({
		where: { status: "ACTIVE" },
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			title: true,
			excerpt: true,
			imageUrl: true,
			createdAt: true,
		},
	});
}

export function getPublicBlog(id: string) {
	return prisma.blog.findFirst({
		where: { id, status: "ACTIVE" },
		select: {
			id: true,
			title: true,
			excerpt: true,
			content: true,
			imageUrl: true,
			createdAt: true,
		},
	});
}
