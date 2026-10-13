import { prisma } from "@/src/lib/prisma";

/**
 * Everything the client-facing app may show: ACTIVE items only. Use these two
 * functions (not prisma.item directly) for any public endpoint, so an inactive
 * item can never leak out by accident. The admin pages query prisma directly
 * because admins see all statuses.
 */
export function listPublicItems() {
	return prisma.item.findMany({
		where: { status: "ACTIVE" },
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			category: true,
			technique: true,
			imageUrl: true,
			createdAt: true,
		},
	});
}

export function getPublicItem(id: string) {
	return prisma.item.findFirst({
		where: { id, status: "ACTIVE" },
		select: {
			id: true,
			category: true,
			technique: true,
			imageUrl: true,
			createdAt: true,
		},
	});
}
