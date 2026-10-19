import { z } from "zod";
import { idSchema, requiredText } from "@/src/core/validation";

/*
 * Zod schemas for items. No server-only imports, so the dashboard form can
 * share them (and the field list) with the API.
 */

/** Every item field is required. */
const fields = {
	category: requiredText("Category", 100),
	technique: requiredText("Technique", 100),
	imageUrl: requiredText("Image link", 2048, { url: true }),
};

export const itemKeys = Object.keys(fields) as (keyof typeof fields)[];

/** Body of /api/item/add. */
export const addItemSchema = z.strictObject(fields);

/** Body of /api/item/edit: the id plus only the fields to change. */
export const editItemSchema = z.strictObject(fields).partial().extend({ id: idSchema });

export type ItemFields = z.output<typeof addItemSchema>;
