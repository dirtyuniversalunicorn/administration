import { z } from "zod";
import { idSchema, optionalText, requiredText } from "@/src/core/validation";

/*
 * Zod schemas for blogs. No server-only imports, so the dashboard form can
 * share them (and the field list) with the API.
 */

/** Title and content are required; the summary and cover image are optional (null). */
const fields = {
	title: requiredText("Title", 150),
	excerpt: optionalText("Summary", 300),
	content: requiredText("Content", 20000),
	imageUrl: optionalText("Cover image link", 2048, { url: true }),
};

export const blogKeys = Object.keys(fields) as (keyof typeof fields)[];

/** Body of /api/blog/add. */
export const addBlogSchema = z.strictObject(fields);

/** Body of /api/blog/edit: the id plus only the fields to change. Null or "" clears an optional one. */
export const editBlogSchema = z.strictObject(fields).partial().extend({ id: idSchema });

export type BlogFields = z.output<typeof addBlogSchema>;
