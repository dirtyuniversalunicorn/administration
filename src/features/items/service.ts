import { fail } from "@/src/core/api";
import { deleteBodySchema, parse, statusBodySchema } from "@/src/core/validation";
import { prisma } from "@/src/lib/prisma";
import { refresh } from "@/src/utils/refresh";
import { itemsFeature } from "./config";
import { adminItemSelect } from "./queries";
import { addItemSchema, editItemSchema } from "./validation";

/*
 * The items' write logic, used by the /api/item/* routes (and nothing else, so
 * the dashboard and external callers behave the same).
 */

/** Creates an item. All three fields are required. */
export async function createItem(body: Record<string, unknown>, userId: string) {
	const input = parse(addItemSchema, body);
	if (!input.ok) return fail(400, input.error);

	const value = await prisma.item.create({
		data: { ...input.value, postedById: userId, editedById: userId },
		select: adminItemSelect,
	});
	refresh(itemsFeature.routes);
	return { ok: true, value } as const;
}

/**
 * Edits an item. Only the fields present in the body change; the others keep their value.
 */
export async function editItem(body: Record<string, unknown>, userId: string) {
	const input = parse(editItemSchema, body);
	if (!input.ok) return fail(400, input.error);
	const { id, ...changes } = input.value;
	if (Object.keys(changes).length === 0) return fail(400, "Send at least one field to change.");

	const existing = await prisma.item.findUnique({ where: { id }, select: { id: true } });
	if (!existing) return fail(404, "Item not found.");

	const value = await prisma.item.update({
		where: { id },
		data: { ...changes, editedById: userId },
		select: adminItemSelect,
	});
	refresh(itemsFeature.routes, id);
	return { ok: true, value } as const;
}

/** Deletes an item for good. 404 if it does not exist. */
export async function deleteItem(body: Record<string, unknown>) {
	const input = parse(deleteBodySchema, body);
	if (!input.ok) return fail(400, input.error);
	const { id } = input.value;

	const { count } = await prisma.item.deleteMany({ where: { id } });
	if (count === 0) return fail(404, "Item not found.");
	refresh(itemsFeature.routes, id);
	return { ok: true, value: { deleted: true } } as const;
}

/** Shows or hides an item on the client-facing app without deleting it. */
export async function setItemStatus(body: Record<string, unknown>, userId: string) {
	const input = parse(statusBodySchema, body);
	if (!input.ok) return fail(400, input.error);
	const { id, status } = input.value;

	const { count } = await prisma.item.updateMany({
		where: { id },
		data: {
			status,
			deactivatedAt: status === "INACTIVE" ? new Date() : null,
			// A status change also bumps editedAt, so record who did it.
			editedById: userId,
		},
	});
	if (count === 0) return fail(404, "Item not found.");

	const value = await prisma.item.findUnique({ where: { id }, select: adminItemSelect });
	refresh(itemsFeature.routes, id);
	return value ? ({ ok: true, value } as const) : fail(404, "Item not found.");
}
