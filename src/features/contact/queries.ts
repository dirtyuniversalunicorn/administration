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

/** The fields that are safe to give anyone: no ids, no admin names or emails. */
export const publicContactSelect = {
	email: true,
	phone: true,
	mobile: true,
	address: true,
	openingHours: true,
	updatedAt: true,
} as const;

/** What `GET /api/contact/get` returns (null when nothing has been added yet). */
export function getPublicContact() {
	return prisma.contact.findFirst({
		orderBy: { createdAt: "asc" },
		select: publicContactSelect,
	});
}
