import { prisma } from "@/src/lib/prisma";

/**
 * The site's contact information. There is one logical record: it is created
 * once from the dashboard and edited afterwards, so the oldest row is "the" one.
 */
export function getContact() {
	return prisma.contact.findFirst({
		orderBy: { createdAt: "asc" },
		include: {
			postedBy: { select: { name: true, email: true } },
			editedBy: { select: { name: true, email: true } },
		},
	});
}
