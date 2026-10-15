"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { appConfig } from "@/src/core/config/appConfig";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export type ItemFormState = { ok: boolean; message: string };

type ItemInput = { category: string; technique: string; imageUrl: string };

async function getSession() {
	return auth.api.getSession({ headers: await headers() });
}

function parseItem(formData: FormData): ItemInput | string {
	const category = String(formData.get("category") ?? "").trim();
	const technique = String(formData.get("technique") ?? "").trim();
	const imageUrl = String(formData.get("imageUrl") ?? "").trim();

	if (!category || !technique || !imageUrl) return "All fields are required.";
	if (category.length > 100 || technique.length > 100)
		return "Category and technique can be at most 100 characters.";
	try {
		const { protocol } = new URL(imageUrl);
		if (protocol !== "http:" && protocol !== "https:") throw new Error();
	} catch {
		return "Image link must be a valid http(s) URL.";
	}
	if (imageUrl.length > 2048) return "Image link is too long.";
	return { category, technique, imageUrl };
}

export async function createItemAction(
	_prev: ItemFormState,
	formData: FormData,
): Promise<ItemFormState> {
	const session = await getSession();
	if (!session) return { ok: false, message: "Not authorized." };

	const input = parseItem(formData);
	if (typeof input === "string") return { ok: false, message: input };

	try {
		await prisma.item.create({
			data: {
				...input,
				postedById: session.user.id,
				editedById: session.user.id,
			},
		});
	} catch (error) {
		console.error("createItemAction failed", error);
		return { ok: false, message: "Failed to create the item." };
	}
	revalidatePath(appConfig.routes.items);
	redirect(appConfig.routes.items);
}

/** Bind the id in the page: `updateItemAction.bind(null, item.id)`. */
export async function updateItemAction(
	id: string,
	_prev: ItemFormState,
	formData: FormData,
): Promise<ItemFormState> {
	const session = await getSession();
	if (!session) return { ok: false, message: "Not authorized." };

	const input = parseItem(formData);
	if (typeof input === "string") return { ok: false, message: input };

	try {
		// editedAt is refreshed automatically (@updatedAt); postedBy stays as is.
		await prisma.item.update({
			where: { id },
			data: { ...input, editedById: session.user.id },
		});
	} catch (error) {
		console.error("updateItemAction failed", error);
		return { ok: false, message: "Failed to save. Does the item still exist?" };
	}
	revalidatePath(appConfig.routes.items);
	revalidatePath(appConfig.routes.item(id));
	redirect(appConfig.routes.items);
}

/** Bind the id in the component: `deleteItemAction.bind(null, id)`. */
export async function deleteItemAction(id: string): Promise<void> {
	const session = await getSession();
	if (!session) throw new Error("Not authorized.");

	// deleteMany: deleting an already-removed item is not an error.
	await prisma.item.deleteMany({ where: { id } });
	revalidatePath(appConfig.routes.items);
	revalidatePath(appConfig.routes.item(id));
	redirect(appConfig.routes.items);
}

/**
 * Soft state change instead of deleting: INACTIVE items stay in the database but
 * disappear from the client-facing app. Bind both args in the page:
 * `setItemStatusAction.bind(null, item.id, "INACTIVE")`.
 */
export async function setItemStatusAction(
	id: string,
	status: "ACTIVE" | "INACTIVE",
): Promise<void> {
	const session = await getSession();
	if (!session) throw new Error("Not authorized.");

	await prisma.item.updateMany({
		where: { id },
		data: {
			status,
			deactivatedAt: status === "INACTIVE" ? new Date() : null,
			// A status change also bumps editedAt, so record who did it.
			editedById: session.user.id,
		},
	});
	revalidatePath(appConfig.routes.items);
	revalidatePath(appConfig.routes.item(id));
}
