import { fail } from "@/src/core/api";
import { parse } from "@/src/core/validation";
import { prisma } from "@/src/lib/prisma";
import { refresh } from "@/src/utils/refresh";
import { contactFeature } from "./config";
import { publicContactSelect } from "./queries";
import { addContactSchema, contactKeys, editContactSchema, isEmptyContact } from "./validation";

/*
 * The contact information's write logic, used by the /api/contact/* routes
 * (and nothing else, so the dashboard and external callers behave the same).
 * There is one logical record: the oldest row is "the" contact information.
 */

/** Creates the contact information. 409 if it already exists (use edit). */
export async function createContact(body: Record<string, unknown>, userId: string) {
	const input = parse(addContactSchema, body);
	if (!input.ok) return fail(400, input.error);

	if (await prisma.contact.findFirst({ select: { id: true } })) {
		return fail(409, "Contact information already exists. Use /api/contact/edit to change it.");
	}

	const value = await prisma.contact.create({
		data: { ...input.value, postedById: userId, editedById: userId },
		select: publicContactSelect,
	});
	refresh(contactFeature.routes);
	return { ok: true, value } as const;
}

/**
 * Edits the contact information. Only the fields present in the body change
 * (send null or "" to clear one); the others keep their value.
 */
export async function editContact(body: Record<string, unknown>, userId: string) {
	const input = parse(editContactSchema, body);
	if (!input.ok) return fail(400, input.error);
	const changes = input.value;
	if (Object.keys(changes).length === 0) return fail(400, "Send at least one field to change.");

	const existing = await prisma.contact.findFirst({
		orderBy: { createdAt: "asc" },
	});
	if (!existing) {
		return fail(404, "No contact information yet. Use /api/contact/add to create it.");
	}

	// Clearing every field would leave nothing, so check the result of the merge.
	const merged = Object.fromEntries(contactKeys.map((key) => [key, key in changes ? changes[key] : existing[key]]));
	if (isEmptyContact(merged)) return fail(400, "Fill in at least one field.");

	const value = await prisma.contact.update({
		where: { id: existing.id },
		data: { ...changes, editedById: userId },
		select: publicContactSelect,
	});
	refresh(contactFeature.routes);
	return { ok: true, value } as const;
}

/** Deletes the contact information. 404 if there is none. */
export async function deleteContact() {
	const { count } = await prisma.contact.deleteMany({});
	if (count === 0) return fail(404, "There is no contact information to delete.");
	refresh(contactFeature.routes);
	return { ok: true, value: { deleted: true } } as const;
}
