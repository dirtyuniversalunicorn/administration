import { z } from "zod";

/*
 * Shared building blocks for the features' zod schemas, plus `parse`, which
 * turns a zod failure into the single `{ error }` message the API returns.
 * Pure (no server-only imports), so forms can use the schemas too.
 */

const isMissing = (input: unknown) => input === undefined || input === null;

const isHttpUrl = (value: string) => {
	try {
		const { protocol } = new URL(value);
		return protocol === "http:" || protocol === "https:";
	} catch {
		return false;
	}
};

type TextOptions = {
	/** Must be a http(s) URL. */
	url?: boolean;
	/** Lower-cases the value. */
	lowercase?: boolean;
	/** An extra format check, with the message to show when it fails. */
	pattern?: [test: RegExp, message: string];
};

/** Trimmed text that must not be blank. Missing or null is "required", other types are "must be text". */
export function requiredText(label: string, max: number, options: TextOptions = {}) {
	let schema = z.string({ error: (issue) => (isMissing(issue.input) ? `${label} is required.` : `${label} must be text.`) }).trim();
	if (options.lowercase) schema = schema.toLowerCase();
	schema = schema.min(1, `${label} is required.`).max(max, `${label} can be at most ${max} characters.`);
	if (options.pattern) schema = schema.regex(options.pattern[0], options.pattern[1]);
	return options.url ? schema.refine(isHttpUrl, `${label} must be a valid http(s) URL.`) : schema;
}

/**
 * Optional trimmed text. Missing, null and blank all become null, so sending
 * null or "" is how a client clears the value. The format checks only run on
 * non-blank text.
 */
export function optionalText(label: string, max: number, options: TextOptions = {}) {
	let schema = z.string({ error: `${label} must be text or null.` }).trim();
	if (options.lowercase) schema = schema.toLowerCase();
	schema = schema.max(max, `${label} can be at most ${max} characters.`);
	if (options.pattern) {
		const [test, message] = options.pattern;
		schema = schema.refine((value) => value === "" || test.test(value), message);
	}
	const text = options.url ? schema.refine((value) => value === "" || isHttpUrl(value), `${label} must be a valid http(s) URL.`) : schema;
	return text.nullish().transform((value) => value || null);
}

/** The id of a record. */
export const idSchema = z.string({ error: "id is required." }).min(1, "id is required.");

/** Body of the delete routes. */
export const deleteBodySchema = z.strictObject({ id: idSchema });

/** Body of the status routes. */
export const statusBodySchema = z.strictObject({
	id: idSchema,
	status: z.enum(["ACTIVE", "INACTIVE"], { error: "status must be ACTIVE or INACTIVE." }),
});

export type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

/** Validates `input` against `schema`. On failure returns the most relevant issue as a plain sentence. */
export function parse<S extends z.ZodType>(schema: S, input: unknown): ParseResult<z.output<S>> {
	const result = schema.safeParse(input);

	if (result.success) return { ok: true, value: result.data };

	const issues = result.error.issues;
	const issue = issues.find((i) => i.code === "unrecognized_keys") ?? issues[0];
	return { ok: false, error: issue.code === "unrecognized_keys" ? `Unknown field: ${issue.keys.join(", ")}.` : issue.message };
}
